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
  subtask: typeSubTask[],
  status: string 
}

type typeSubTask = {
  title: string,
  isCompleted: boolean
}

type typeTempSubTask = {
  id: string,
  text: string,
  placeholder: string
}

function TaskAdd( { edit = false }: { edit?: boolean } ) {
  const { database, taskAdmin }       = useDatabase()
  const { dialogLaunch, dialogsData } = useDialogs()

  // Load coordinates of selected Task:
  const board  = dialogsData![1]
  const column = dialogsData![2]
  const task   = dialogsData![3]

  const [tempSubTasks, setTempSubTasks] = useState<typeTempSubTask[]>([])
  const defaultSubTasks = [
    { id: '0', text: '', placeholder: 'e.g. Make Coffee' },
    { id: '1', text: '', placeholder: 'e.g. Drink coffee & smile' },
  ]
  
  const [counter, setCounter] = useState(edit ? 0 : defaultSubTasks.length)
  const [columns, setColumns] = useState<typeTempColumns[]>()

  const [title, setTitle]             = useState("")
  const [description, setDescription] = useState("")
  const [status,   setStatus]         = useState("")
  const [subTasks, setSubTasks]       = useState<typeSubTask[]>([])
  // const [taskData, setTaskData]       = useState<typeTask>()

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      if(edit) {
        setTitle(database.boards[board!].columns[column!].tasks[task!].title)
        setDescription(database.boards[board!].columns[column!].tasks[task!].description)
        setSubTasks(database.boards[board!].columns[column!].tasks[task!].subtasks)
        const _tempSubTasks = [...database.boards[board!].columns[column!].tasks[task!].subtasks]
        let _counter = 0
        setTempSubTasks(_tempSubTasks.map(subTask => {
                        return({ id: (_counter++).toString(), text: subTask.title, placeholder: "" })
                      }))
        setCounter(_counter)
      }
      else {
        setTempSubTasks(defaultSubTasks)
      }
      let cols: typeTempColumns[] = database.boards[board!].columns.map((column: any) => {
        return { value: column.name, label: column.name }
      })
      setStatus(cols[column!].value)
      setColumns(cols)
    }
  }, [])
  
  function addSubTask() {
    setTempSubTasks([...tempSubTasks, 
      {id: counter.toString(), text: "", placeholder: `New subtask ${counter}...`}])
    setCounter(counter + 1)
    setSubTasks([...subTasks,
      { title: `New subtask ${counter}...`, isCompleted: false }
    ])
  }

  function deleteSubTask(index: number) {
    // ----------------------------------
    const _tempSubTasks = tempSubTasks
    _tempSubTasks.splice(index, 1)
    setTempSubTasks([..._tempSubTasks])
    // ----------------------------------
    const _subTasks = subTasks
    _subTasks.splice(index, 1)
    setSubTasks([..._subTasks])
  }

  function handleChange_title(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault()
    setTitle(e.target.value)
  }

  function handleChange_description(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault()
    setDescription(e.target.value)
  }

  function handleChange_subTask(e: React.ChangeEvent<HTMLTextAreaElement>, index: number) {
    e.preventDefault()
    let _subTasks = subTasks
    _subTasks[index].title = e.target.value
    setSubTasks(_subTasks)
  }

  function handleChange_Status() {
    console.log("Cambio de Status...")
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    dialogLaunch("saveTask", board, column, task)
    let taskData = { title: title, description: description, status: status, subtasks: subTasks }
    taskAdmin("task_Modify", [board!, column!, task!], taskData)
  }

  return (
    <DialogModal>

      <section className="taskadd__dialog--title">
        {`${edit ? "Edit Task" : "Add New Task"}`}
      </section>

      <form onSubmit={handleSubmit}>
        <section className="taskadd__title">
          <div className="taskadd__-title">Title</div>
          <div className="taskadd__-text">
            <textarea spellCheck={false}
              placeholder='e.g. Take coffee break'
              defaultValue = {title}
              onChange={handleChange_title}
            />
          </div>
        </section>
        <section className="taskadd__description">
          <div className="taskadd__-title">Description</div>
          <div className="taskadd__-text">
            <textarea spellCheck={false}
              placeholder='e.g. It´s always good to take a break. This 15 minute break will  recharge the batteries a little.'
              defaultValue = {description}
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
                  <motion.div className="taskadd__-text" key={subtask.id}
                    layout     = {true}
                    initial    = {{ opacity: 0, scale: 0 }}
                    animate    = {{ opacity: 1, scale: 1, 
                      transition: { type: "spring", damping: 20, stiffness: 250 } }}
                    exit       = {{ opacity: 0, scale: 0.3 }}
                    transition = {{ duration: 0.3 }}
                  >
                    <textarea spellCheck={false}
                      placeholder  = {subtask.placeholder}
                      defaultValue = {subtask.text}
                      onChange     = {(e) => handleChange_subTask(e, index)}
                    />
                    <div className = "taskadd__delete"
                      onClick={() => deleteSubTask(index)}
                    >
                    </div>
                  </motion.div>
              )) : <motion.div><h1 className='no-columns'>No Subtasks!</h1></motion.div>
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
                defaultValue    = {{ value: status, label: status }}
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