import './TaskAdd.css'
import { useEffect, useState } from 'react'
import useDatabase from '../hooks/useDatabase'
import useDialogs  from '../hooks/useDialogs'
import DialogModal from './DialogModal'
import Select from 'react-select'
import { Button } from './Button'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'

type typeColumns = {
  value: string,
  label: string
}
  
type typeSubtask = {
  id: string,
  text: string,
  placeholder: string
}

function TaskAdd( { board, edit = false }: { board?: number, edit?: boolean } ) {
  const { database }     = useDatabase()
  const { dialogLaunch, dialogsData } = useDialogs()

  const [tempSubTasks, setTempSubTasks] = useState<typeSubtask[]>([])
  const [defaultSubTasks, setDefaultSubTasks] = useState<any[]>([
    { id: '0', text: '', placeholder: 'e.g. Make Coffee' },
    { id: '1', text: '', placeholder: 'e.g. Drink coffee & smile' },
  ])
  const [counter, setCounter] = useState(edit ? 0 : defaultSubTasks.length)
  const [columns, setColumns] = useState<typeColumns[]>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      if(edit) {
        const column = dialogsData[2]
        const task   = dialogsData[3]
        setTitle(database.boards[board!].columns[column!].tasks[task!].title)
        setDescription(database.boards[board!].columns[column!].tasks[task!].description)
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
      let cols: typeColumns[] = database.boards[board!].columns.map((column: any) => {
        return { value: column.name, label: column.name }
      })
      setColumns(cols)
    }
  }, [])
  
  function addSubTask() {
    setTempSubTasks([...tempSubTasks, 
      {id: counter.toString(), text: "", placeholder: `New subtask ${counter}...`}])
    setCounter(counter + 1)
  }

  function deleteSubTask(index: number) {
    const _tempSubTasks = tempSubTasks
    _tempSubTasks.splice(index, 1)
    setTempSubTasks([..._tempSubTasks])
  }

  function createTask() {
    dialogLaunch("createTask", dialogsData.length + 1, 0, 0)
  }

  return (
    <DialogModal>
      <section className="taskadd__dialog--title">
        {`${edit ? "Edit Task" : "Add New Task"}`}
      </section>
      <section className="taskadd__title">
        <div className="taskadd__-title">Title</div>
        <div className="taskadd__-text">
          <textarea spellCheck={false}
            placeholder='e.g. Take coffee break'
            defaultValue = {title}
          />
        </div>
      </section>
      <section className="taskadd__description">
        <div className="taskadd__-title">Description</div>
        <div className="taskadd__-text">
          <textarea spellCheck={false}
            placeholder='e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little.'
            defaultValue = {description}
            style={{minHeight: "112px"}}
          />
        </div>
      </section>
      <section className="taskadd__subtasks">
        <div className="taskadd__-title">Subtasks</div>
        <div className="taskadd__subtasks--items">
          <LayoutGroup>
          <AnimatePresence>
            { tempSubTasks.length ? (
              tempSubTasks.map((subtask: typeSubtask, index: number) => 
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
        <Button className="taskadd__btn-add secondary"
          onClick={addSubTask}
        >
          + Add New Subtask
        </Button>
      </section>
      <section className="taskadd__status">
        <div className="taskadd__-title">Status</div>
        <div className="taskadd__current-status--items">
          { columns &&
            <Select 
              defaultValue={columns[0]}
              options={columns}
              className='taskadd__current-status-select' 
              classNamePrefix='taskadd__current-status-select'
            />
          }
        </div>
      </section>
      <section className="taskadd__create">
        <Button className="taskadd__btn-create primary"
          onClick={createTask}
        >
          {`${edit ? "Save Changes" : "Create Task"}`}
        </Button>
      </section>
    </DialogModal>
  )
}
export default TaskAdd