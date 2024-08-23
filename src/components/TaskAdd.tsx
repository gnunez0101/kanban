import './TaskAdd.css'
import { useEffect, useState } from 'react'
import useDatabase from '../hooks/useDatabase'
import useDialogs  from '../hooks/useDialogs'
import DialogModal from './DialogModal'
import Select from 'react-select'
import { Button } from './Button'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'

type typeColumns = {
  name: string,
  tasks: typeTask[]
}

type typeTempColumns = {
  value: string,
  label: string
}

type typeTask = {
  title: string,
  description: string,
  status: string,
  subtasks: typeSubTask[],
}

type typeSubTask = {
  title: string,
  isCompleted: boolean
}

type typeTempSubTask = {
  id: string,
  text: string,
  placeholder: string,
  isCompleted: boolean,
  isEmpty: boolean
}

function TaskAdd( { edit = false }: { edit?: boolean } ) {
  const { database, dispatch }       = useDatabase()
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

  const [title, setTitle]             = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus]           = useState("")

  const [titleError, setTitleError] = useState(false)

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      if(edit) {
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
      let cols: typeTempColumns[] = database.boards[board!].columns.map((column: typeColumns, index: number) => {
        return { value: index.toString(), label: column.name }
      })
      setStatus(cols[column!].label)
      setColumns(cols)
    }
  }, [])
  
  function addSubTask() {
    setTempSubTasks([...tempSubTasks, 
      { id: counter.toString(), text: "", placeholder: `New subtask ${counter}...`, isCompleted: false, isEmpty: false}])
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
    // ----------------------------------------------------------------------------------
    console.log("Cambio de Status de", column, "a ", status.label, parseInt(status.value))
    // ----------------------------------------------------------------------------------
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    var emptyError = false
    // Empty Title Validation:
    if (title.trim().length === 0) { setTitleError(true); emptyError = true }
    // No Subtasks Validation:
    if (tempSubTasks.length === 0 ) {
      for(let i = 0; i < tempSubTasks.length; i++) {
        tempSubTasks[i].isEmpty = ( tempSubTasks[i].text.length === 0 )
      }
      return
    }
    else {
      // Empty Subtask Validation:
      const _tempSubTasks: typeTempSubTask[] = JSON.parse(JSON.stringify(tempSubTasks))
      // var _tempSubTasks = tempSubTasks
      for(let i = 0; i < _tempSubTasks.length; i++) {
        if (_tempSubTasks[i].text.trim().length === 0) {
          emptyError = true
          _tempSubTasks[i].isEmpty = true
        }
      }
      setTempSubTasks(_tempSubTasks)
    }
    if (emptyError) return

    // Converting tempSubTask to subTasks:
    const subTasks: typeSubTask[] = tempSubTasks.map( (subtask: typeTempSubTask) => (
        { title: subtask.text, isCompleted: subtask.isCompleted } 
      ))
    // Constructing Task object:
    const taskData: typeTask = { 
      title: title.trim(), 
      description: description.trim(), 
      status: status, 
      subtasks: subTasks 
    }

    // Writing values to database:
    // ====================================================================================================
    if ( edit ) {
      // Modify an existing Task:
      dialogLaunch("saveTask", board, column, task)
      // taskAdmin( "task_Modify", [board!, column!], taskData )
      dispatch({ type: "task_Modify", coord: [board!, column!], values: taskData })
    }
    else {
      // Create a New Task:
      dialogLaunch("createTask", board, column, task)
      // taskAdmin("task_Add", [board!, column!], taskData)
      dispatch({ type: "task_Add", coord: [board!, column!], values: taskData })
      console.log("Tarea agregada!")
    }
    setSubTaskChange(true)
    // ====================================================================================================
  }

  return (
    <DialogModal>

      <section className="taskadd__dialog--title">
        {`${edit ? "Edit Task" : "Add New Task"}`}
      </section>

      <form onSubmit={handleSubmit}>
        <section className = "taskadd__title">
          <div className = "taskadd__-title">Title</div>
          <div className = { `taskadd__-text ${titleError ? "error" : ""}` } >
            <textarea spellCheck={false}
              className   = "taskadd_textarea"
              placeholder = 'e.g. Take coffee break'
              value = {title}
              onChange={handleChange_title}
            />
            <div className="inputError">Can't be empty</div>
          </div>
        </section>
        <section className="taskadd__description">
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
        </section>
        <section className="taskadd__subtasks">
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
          <Button className="taskadd__btn-add secondary" onClick={addSubTask} type="button">
            + Add New Subtask
          </Button>
        </section>
        <section className="taskadd__status">
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
        </section>
        <section className="taskadd__create">
          <Button className="taskadd__btn-create primary">
            {`${edit ? "Save Changes" : "Create Task"}`}
          </Button>
        </section>
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