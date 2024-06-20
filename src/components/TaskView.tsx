import './TaskView.css'
import { useEffect, useRef, useState  } from 'react'
import { Checkbox } from './Checkbox'
import Select from 'react-select';
import ellipsis from '../assets/icon-vertical-ellipsis.svg'
import { AnimatePresence, motion } from 'framer-motion'
import useDatabase from '../hooks/useDatabase'
import useDialogs  from '../hooks/useDialogs'
import DialogModal from './DialogModal'
import { useClickAway } from 'simple-react-clickaway'

function TaskView( { board, column, task }: { board?: number, column?: number, task?: number } ) {

  const { database } = useDatabase()
  const [showMenu, setShowMenu] = useState(false)
  const [columns, setColumns]   = useState<any>([])
  const [taskData, setTaskData] = useState<any>([])
  const [subTasks, setSubTasks] = useState<any>([])
  const [countCompleted, setCountCompleted] = useState(0)
  const [countTotal, setCountTotal]         = useState(0)

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      let cols = database.boards[board!].columns.map((column: any) => {
        return { value: column.name, label: column.name }
      })
      setColumns(cols)
      setTaskData(database.boards[board!].columns[column!].tasks[task!])
      setSubTasks(database.boards[board!].columns[column!].tasks[task!].subtasks)
    }
  }, [])

  useEffect(() => {
    if (subTasks) {
      setCountCompleted(subTasks.filter((c: any) => c.isCompleted).length)
      setCountTotal(subTasks.length)
    }
  }, [subTasks])

  function handleCheck(index: number) {
    let _subTask = [...subTasks]
    _subTask[index].isCompleted = !_subTask[index].isCompleted
    setSubTasks([..._subTask])
  }

  return (
    <>{ taskData && <DialogModal>
      <section className="taskview__title">
        <textarea className="taskview__title--text" spellCheck={false}
          placeholder='Write a title...'
          readOnly = {true}
          defaultValue = {taskData.title}
        />
        <div className="taskview__title--ellipsis">
          <motion.div className="taskview__title--ellipsis-toggle"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            whileHover = {{ scale: [1, 1.4, 1, 1.2, 1] }}
            whileTap   = {{ scale: 0.9 }}
          >
            <img src={ellipsis} alt="ellipsis" />
          </motion.div>
          <AnimatePresence>
            { showMenu && <MenuEllipsis setShowMenuEllipsis={setShowMenu}
                                        board={board} column={column} task={task}
            /> }
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
          { subTasks && subTasks.map((subtask: any, index: number) =>
            <div className={`taskview__subtasks--items__subtask`}
              onClick = { () => handleCheck(index) } key={index}
            >
              <Checkbox className = "taskview__subtasks--items__completed"
                isChecked    = { subtask.isCompleted }
                label        = { subtask.title }
                handleChange = { () => handleCheck(index) }
                key          = { index }
              />
            </div>
          )}
        </div>
      </section>
      <section className="taskview__current-status">
        <div className="taskview__current-status--title">
          Current Status
        </div>
        <div className="taskview__current-status--items">
          <Select options={columns}
            className='taskview__current-status-select' 
            classNamePrefix="taskview__current-status-select" 
            defaultValue={{ value: taskData.status, label: taskData.status }}
          />
        </div>
      </section>
    </DialogModal>
    }</>
  )
}
export default TaskView

function MenuEllipsis( { board, column, task, setShowMenuEllipsis }: { board?: number, column?: number, task?: number, setShowMenuEllipsis: any } ) {
  const refMenu = useRef(null)
  const { disable, enable } = useClickAway(refMenu, () => setShowMenuEllipsis(false))
  const { dialogLaunch } = useDialogs()
  
  useEffect(() => {
    enable()
    return () => disable() 
  }, [])

  return (
    <motion.div className="taskview__title--ellipsis-menu"
      initial    = {{ scaleY: 0 }}
      animate    = {{ scaleY: 1 }}
      exit       = {{ scaleY: 0 }}
      transition = {{ duration: 0.2 }}
      ref={refMenu}
    >
      <div className="taskview__title--ellipsis-menu__option edit"
        onClick={(e) => {
          e.stopPropagation()
          setShowMenuEllipsis(false)
          dialogLaunch("taskEdit", board, column, task)
        }}
      >Edit Task
      </div>
      <div className="taskview__title--ellipsis-menu__option delete"
        onClick={(e) => {
          e.stopPropagation()
          setShowMenuEllipsis(false)
          dialogLaunch("taskDelete", board, column, task)
        }}
      >Delete Task</div>
    </motion.div>
  )
}