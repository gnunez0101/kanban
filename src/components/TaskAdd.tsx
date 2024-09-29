import './TaskAdd.css'
import './types'
import { Button } from './Button'
import { useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import DialogModal from './DialogModal'
import useDatabase from '../hooks/useDatabase'
import useDialogs  from '../hooks/useDialogs'
import Select from 'react-select'

type typeTempColumns = {
  value: string,
  label: string
}

type typeTempSubTask = {
  id: string,
  text: string,
  placeholder: string,
  isCompleted: boolean,
  isEmpty: boolean
}

function TaskAdd( { edit = false }: { edit?: boolean } ) {
  const { database, dispatch, taskCounter, setTaskCounter }       = useDatabase()
  const { dialogLaunch, dialogsData, setSubTaskChange } = useDialogs()

  // Load coordinates of selected Task:
  const board  = dialogsData![1]
  const column = dialogsData![2]
  const task   = dialogsData![3]

  const [tempSubTasks, setTempSubTasks] = useState<typeTempSubTask[]>([])
  const defaultSubTasks: typeTempSubTask[] = [
    { id: '0', text: '', placeholder: 'e.g. Make Coffee',          isCompleted: false, isEmpty: false },
    { id: '1', text: '', placeholder: 'e.g. Drink coffee & smile', isCompleted: false, isEmpty: false },
  ]
  
  const [counter, setCounter] = useState(edit ? 0 : defaultSubTasks.length)
  const [columns, setColumns] = useState<typeTempColumns[]>()
  const [selectedColumn, setSelectedColumn] = useState(-1)

  const [title, setTitle]             = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus]           = useState<typeTempColumns>()
  const [taskID, setTaskID]           = useState("")

  const [titleError, setTitleError] = useState(false)

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      if(edit) {
        setTaskID(database.boards[board!].columns[column!].tasks[task!].id!)
        setTitle(database.boards[board!].columns[column!].tasks[task!].title)
        setDescription(database.boards[board!].columns[column!].tasks[task!].description)
        // Deep clone of subtask elements on temp state with "JSON.stringify" method:
        const _tempSubTasks: typeSubTask[] = 
          JSON.parse(JSON.stringify(database.boards[board!].columns[column!].tasks[task!].subtasks))
        let _counter = 0
        setTempSubTasks(_tempSubTasks.map((subTask: typeSubTask) => {
                        return({ id: (_counter++).toString(), text: subTask.title, placeholder: "", isCompleted: subTask.isCompleted, isEmpty: false })
                      }))
        setCounter(_counter)
      }
      else {
        setTempSubTasks(defaultSubTasks)
      }
      let cols: typeTempColumns[] = database.boards[board!].columns.map((column: typeColumn, index: number) => {
        return { value: index.toString(), label: column.name }
      })
      setStatus(cols[column!])
      setColumns(cols)
      setSelectedColumn(column!)
    }
  }, [])
  
  function addSubTask() {
    setTempSubTasks([...tempSubTasks, 
      { id: counter.toString(), text: "", placeholder: "New subtask...", isCompleted: false, isEmpty: false}])
    setCounter(counter + 1)
  }

  function deleteSubTask(index: number) {
    const _tempSubTasks = tempSubTasks
    _tempSubTasks.splice(index, 1)
    setTempSubTasks([..._tempSubTasks])
  }

  function handleChange_title(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault()
    setTitle(e.target.value)
    setTitleError(e.target.value.trim() === "")  // if input is empty
  }

  function handleChange_description(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault()
    setDescription(e.target.value)
  }

  function handleChange_subTask(e: React.ChangeEvent<HTMLTextAreaElement>, index: number) {
    e.preventDefault()
    const _tempSubTasks: typeTempSubTask[] = JSON.parse(JSON.stringify(tempSubTasks))
    _tempSubTasks[index].text = e.target.value
    _tempSubTasks[index].isEmpty = ( e.target.value.length === 0 )
    setTempSubTasks(_tempSubTasks)
  }

  function handleChange_Status(status: any) {
    setStatus(status.label)
    setSelectedColumn(status.value)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    var emptyError = false

    // Empty Title Validation:
    if (title.trim().length === 0) { setTitleError(true); emptyError = true }
    
    // No Subtasks Validation:
    // if (tempSubTasks.length === 0 ) return
    
    // Empty Subtask Validation:
    const _tempSubTasks: typeTempSubTask[] = JSON.parse(JSON.stringify(tempSubTasks))
    for(let i = 0; i < _tempSubTasks.length; i++) {
      if (_tempSubTasks[i].text.trim().length === 0) {
        emptyError = true
        _tempSubTasks[i].isEmpty = true
      }
    }
    setTempSubTasks(_tempSubTasks)
    if (emptyError) return

    // Converting tempSubTask to subTasks:
    const _subTasks: typeSubTask[] = tempSubTasks.map( ( subtask: typeTempSubTask ) => (
        { title: subtask.text, isCompleted: subtask.isCompleted } 
      ))
    // Constructing Task object:
    const taskData: typeTask = { 
      title: title.trim(), 
      description: description.trim(), 
      status: status!.label, 
      subtasks: _subTasks,
      id: edit ? taskID : (taskCounter+1).toString()
    }

    // Writing values to database:
    // ====================================================================================================
    if ( edit ) {
      // Modify an existing Task:
      dialogLaunch("saveTask", board, column, task)
      // Save changes on current Task:
      dispatch({ type: "task_Modify", coord: [board!, column!, task!], values: taskData })
      if(column !== selectedColumn) {  // Move to different column if status has been changed:
        dispatch({ type: 'task_MoveColumn', coord: [board!, column!, task!], dest: selectedColumn })
      }
    }
    else {
      // Create a New Task:
      dialogLaunch("createTask", board, column, task)
      dispatch({ type: "task_Add", coord: [board!, selectedColumn], values: taskData })
      setTaskCounter(taskCounter+1)
    }
    setSubTaskChange(true)
    // ====================================================================================================
  }

  return (
    <DialogModal>

      <div className="taskadd__dialog--title">
        {`${edit ? "Edit Task" : "Add New Task"}`}
      </div>

      <form onSubmit={handleSubmit} className='taskadd__form'>

        <div className = "taskadd__title">
          <div className = "taskadd__-title">Title</div>
          <div className = { `taskadd__-text ${titleError ? "error" : ""}` } >
            <textarea spellCheck={false}
              autoFocus
              className   = "taskadd_textarea"
              placeholder = 'e.g. Take coffee break'
              value = {title}
              onChange={handleChange_title}
            />
            <div className="inputError">Can't be empty</div>
          </div>
        </div>

        <div className="taskadd__description">
          <div className="taskadd__-title">Description</div>
          <div className="taskadd__-text">
            <textarea spellCheck={false}
              className='taskadd_textarea'
              placeholder='e.g. It´s always good to take a break. This 15 minute break will  recharge the batteries a little.'
              value = {description}
              style={{minHeight: "112px"}}
              onChange={handleChange_description}
            />
          </div>
        </div>

        <div className="taskadd__subtasks">
          <div className="taskadd__-title">Subtasks</div>
          <div className="taskadd__subtasks--items">
            <LayoutGroup>
            <AnimatePresence>
              { tempSubTasks.length ? (
                tempSubTasks.map((subtask: typeTempSubTask, index: number) => 
                  <SubTask index={index} key={subtask.id}
                           defaultValue  = {subtask.text}
                           placeholder   = {subtask.placeholder}
                           handleChange  = {(e) => handleChange_subTask(e, index)}
                           deleteSubTask = {() => deleteSubTask(index) }
                           isEmpty       = {subtask.isEmpty}
                  />
                )) 
                :
                <motion.div className='no-subtasks'>No Subtasks!</motion.div>
              }
            </AnimatePresence>
            </LayoutGroup>
          </div>
          <Button className="taskadd__btn-add secondary" type="button"
            onClick={addSubTask}
          >+ Add New Subtask
          </Button>
        </div>

        <div className="taskadd__status">
          <div className="taskadd__-title">Status</div>
          <div className="taskadd__current-status--items">
            { columns &&
              <Select 
                defaultValue    = {columns[column!]}
                options         = {columns}
                className       = 'taskadd__current-status-select' 
                classNamePrefix = 'taskadd__current-status-select'
                onChange        = {handleChange_Status}
              />
            }
          </div>
        </div>

        <div className="taskadd__create">
          <Button className="taskadd__btn-create primary">
            {`${edit ? "Save Changes" : "Create Task"}`}
          </Button>
        </div>
        
      </form>

    </DialogModal>
  )
}
export default TaskAdd


type typePropsSubTask = {
  index: number, 
  defaultValue: string, 
  placeholder: string, 
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void, 
  deleteSubTask: (index: number) => void,
  isEmpty: boolean
}

function SubTask( props: typePropsSubTask ) {

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>, index: number) {
    props.handleChange(e, index)
  }

  return (
    <motion.div className = { `taskadd__-text ${ props.isEmpty ? "error" : ""}` }
      layout     = {true}
      initial    = {{ opacity: 0, scale: 0 }}
      animate    = {{ opacity: 1, scale: 1, 
        transition: { type: "spring", damping: 20, stiffness: 250 } }}
      exit       = {{ opacity: 0, scale: 0.3 }}
      transition = {{ duration: 0.3 }}
    >
      <textarea spellCheck={false}
        className    = "taskadd_textarea"
        placeholder  = {props.placeholder}
        defaultValue = {props.defaultValue}
        onChange     = {(e) => handleChange(e, props.index)}
      />
      <div className = "taskadd__delete"
        onClick={() => props.deleteSubTask(props.index)}
      >
      </div>
      <div className = "inputError">Can't be empty</div>
    </motion.div>
  )
}