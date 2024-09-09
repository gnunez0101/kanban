import './TaskView.css'
import { useEffect, useRef, useState  } from 'react'
import { Checkbox } from './Checkbox'
import ellipsis from '../assets/icon-vertical-ellipsis.svg'
import { useRaisedShadow } from '../hooks/useRaisedShadows'
import useDatabase from '../hooks/useDatabase'
import useDialogs  from '../hooks/useDialogs'
import DialogModal from './DialogModal'
import Select from 'react-select';
import { useClickAway } from 'simple-react-clickaway'
import { AnimatePresence, Reorder, motion, useMotionValue } from 'framer-motion'
import { useImmer } from 'use-immer'

function TaskView( { board, column, task }: 
  { board?: number, column?: number, task?: number } ) {

  const { database, dispatch }              = useDatabase()
  const { subtaskChange, setSubTaskChange } = useDialogs()
  
  const [showMenu, setShowMenu] = useState(false)
  const [columns, setColumns]   = useState<typeSelectColumns[]>([])
  const [status, setStatus]     = useState("")
  const [taskData, setTaskData] = useState<any>([])
  const [subTasks, setSubTasks] = useImmer<typeSubTask[]>([])
  const [countCompleted, setCountCompleted] = useState(0)
  const [countTotal, setCountTotal]         = useState(0)

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      let cols = database.boards[board!].columns.map((column: any, index: number) => {
        return { value: index.toString(), label: column.name }
      })
      setColumns(cols)
      setStatus(cols[column!].label)
      setTaskData(database.boards[board!].columns[column!].tasks[task!])
      setSubTasks(database.boards[board!].columns[column!].tasks[task!].subtasks )
      setSubTaskChange(true)
    }
  }, [])

  useEffect(() => {
    if (subTasks) {
      setCountCompleted(subTasks.filter((c: typeSubTask) => c.isCompleted).length)
      setCountTotal(subTasks.length)
    }
  }, [subtaskChange])

  function handleCheck(index: number) {
    const checkNewStatus = !subTasks[index].isCompleted
    const valueSubTask = { title: subTasks[index].title, isCompleted: checkNewStatus }
    // Write to local state:
    setSubTasks(draft => { draft[index].isCompleted = checkNewStatus })
    // Write to global state:
    dispatch({ type: "subtask_Modify", coord: [board!, column!, task!, index], values: valueSubTask })
    // Notify parent for rendering:
    setSubTaskChange(true)
  }

  function handleReorder(newOrder: typeSubTask[]) {
    // Write to local state:
    setSubTasks(newOrder)
    // Write to global state:
    dispatch({ type: "task_Modify", coord: [board!, column!, task!], values: {...taskData, subtasks: newOrder} })
  }

  function handleStatus (selectedStatus: any) {
    // Move Task to different column:
    dispatch({ type: 'task_Move', coord: [board!, column!, task!], dest: parseInt(selectedStatus.value) })
  }

  return (
    <DialogModal>
      <section className = "taskview__title">
        <textarea className = "taskview__title--text" spellCheck = {false}
          placeholder = 'Write a title...'
          readOnly = {true}
          defaultValue = {taskData.title}
        />
        <div className="taskview__title--ellipsis">
          <motion.div className="taskview__title--ellipsis-toggle"
            onClick = { (e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            whileHover = {{ scale: [1, 1.4, 1, 1.2, 1] }}
            whileTap   = {{ scale: 0.9 }}
          >
            <img src={ellipsis} alt="ellipsis" />
          </motion.div>
          <AnimatePresence>
            { showMenu && 
              <MenuEllipsis setShowMenuEllipsis={setShowMenu}
                            board={board} column={column} task={task}
              />
            }
          </AnimatePresence>
        </div>
      </section>
      <div className="taskview__description">
        <textarea spellCheck={false}
          placeholder  ='Write a description...'
          readOnly     = {true} 
          defaultValue = {taskData.description}
        />
      </div>
      <section className="taskview__subtasks">
        <div className="taskview__subtasks--title">
          Subtasks {`(${countCompleted} of ${countTotal})`}
        </div>
        <div className="taskview__subtasks--items">
          <Reorder.Group axis = "y" onReorder = {handleReorder} values = {subTasks}>
            { subTasks &&
              subTasks.map((subtask: typeSubTask, index: number) =>
                <SubTask item = {subtask} key={subtask.title}
                  handleChange = { () => handleCheck(index) }
                />)
            }
          </Reorder.Group>
        </div>
      </section>
      <section className="taskview__current-status">
        <div className="taskview__current-status--title">
          Current Status
        </div>
        <div className="taskview__current-status--items">
          { status &&
            <Select options = {columns}
              className       = "taskview__current-status-select"
              classNamePrefix = "taskview__current-status-select"
              defaultValue    = {{ value: status, label: status }}
              onChange        = {handleStatus}
            />
          }
        </div>
      </section>
    </DialogModal>
  )
}
export default TaskView

function MenuEllipsis( { board, column, task, setShowMenuEllipsis }: { board?: number, column?: number, task?: number, setShowMenuEllipsis: (show: boolean) => void } ) {
  const refMenu = useRef(null)
  const { disable, enable } = useClickAway(refMenu, () => setShowMenuEllipsis(false))
  const { dialogLaunch } = useDialogs()
  
  useEffect(() => {
    enable()
    return () => disable() 
  }, [])

  return (
    <motion.div className = "taskview__title--ellipsis-menu"
      initial    = {{ scaleY: 0 }}
      animate    = {{ scaleY: 1 }}
      exit       = {{ scaleY: 0 }}
      transition = {{ duration: 0.2 }}
      ref        = {refMenu}
    >
      <div className = "taskview__title--ellipsis-menu__option edit"
        onClick = {(e) => {
          e.stopPropagation()
          setShowMenuEllipsis(false)
          dialogLaunch("taskEdit", board, column, task)
        }}
      >
        Edit Task
      </div>
      <div className = "taskview__title--ellipsis-menu__option delete"
        onClick = {(e) => {
          e.stopPropagation()
          setShowMenuEllipsis(false)
          dialogLaunch("taskDelete", board, column, task)
        }}
      >
        Delete Task
      </div>
    </motion.div>
  )
}

function SubTask({ item, handleChange }: {item: typeSubTask, handleChange: () => void}) {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)

  return(
    <Reorder.Item value = {item} id={item.title} key={item.title} style={{ boxShadow, y }}
      // dragConstraints = {{ top: 10, bottom: -10 }}
    >
      <motion.div className={`taskview__subtasks--items__subtask`}
        // onClick = { () => handleCheck(index) }
        whileTap={{ cursor: "grabbing" }}
      >
        <Checkbox className = "taskview__subtasks--items__completed"
          isChecked    = { item.isCompleted }
          handleChange = { handleChange }
        />
        <span>{item.title}</span>
      </motion.div>
    </Reorder.Item>
  )
}