import './TaskAdd.css'
import { useEffect, useState } from 'react'
import useDatabase from '../hooks/useDatabase'
import useDialogs  from '../hooks/useDialogs'
import Backdrop from './Backdrop'
import crossIcon from '../assets/icon-cross.svg'
import { motion, AnimatePresence } from 'framer-motion'
import { Checkbox } from './Toggle'
import Select from 'react-select'

function TaskAdd( { board, add = false }: { board: number, add?: boolean } ) {
  const { database }       = useDatabase()
  const { setDialogsData } = useDialogs()

  // const taskData = database.boards[board].columns[column]
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing]   = useState(false)
  const [subtasks, setSubtasks] = useState<any[]>([
    { text: '', placeholder: 'e.g. Make Coffee' },
    { text: '', placeholder: 'e.g. Drink coffee & smile' },
  ])

  const [columns, setColumns] = useState<any>([])

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      let cols = database.boards[board].columns.map((column: any) => {
        return { value: column.name, label: column.name }
      })
      setColumns(cols)
    }
  }, [])

  function closeDialog() {
    setDialogsData(null)
  }

  const dialogVariant = {
    hide: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { type: "spring", damping: 22, stiffness: 700 }  },
    exit: { scale: 0, opacity: 0, transition: { ease: "backOut" } },
  }

  return (
    <Backdrop onClick={closeDialog}>
      <motion.div className="taskadd"
        onClick={(e) => e.stopPropagation()}
        variants={dialogVariant}
        initial="hide"
        animate="show"
        exit   ="exit"
      >
        <section className="taskadd__dialog--title">
          {`${add ? "Add New Task" : "Edit Task"}`}
        </section>
        <section className="taskadd__title">
          <div className="taskadd__-title">Title</div>
          <div className="taskadd__-text">
            <textarea spellCheck={false}
              placeholder='e.g. Take coffee break'
              defaultValue = {""}
            />
          </div>
        </section>
        <section className="taskadd__description">
          <div className="taskadd__-title">Description</div>
          <div className="taskadd__-text">
            <textarea spellCheck={false}
              placeholder='e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little.'
              defaultValue = {""}
              style={{minHeight: "112px"}}
            />
          </div>
        </section>
        <section className="taskadd__subtasks">
          <div className="taskadd__-title">Subtasks</div>
          <div className="taskadd__items">
            { subtasks.map((subtask: typeSubtask, index: number) => 
              <Subtask data={subtask} key={index}/>
            )}
          </div>
          <motion.button className="taskadd__btn-add"
            initial   ={{ scale: 1 }}
            whileHover={{ scale: [1, 1.05, 1, 1.025, 1] }}
            whileTap  ={{ scale: 0.98 }}
          >
            + Add New Subtask
          </motion.button>
        </section>
        <section className="taskadd__status">
          <div className="taskadd__-title">Status</div>
          <div className="taskadd__current-status--items">
            <Select options={columns}
              className='taskadd__current-status-select' 
              classNamePrefix='taskadd__current-status-select'
              value={columns[0]}
            />
          </div>
        </section>
        <section className="taskadd__create">
          <motion.button className="taskadd__btn-create"
              initial   ={{ scale: 1 }}
              whileHover={{ scale: [1, 1.05, 1, 1.025, 1] }}
              whileTap  ={{ scale: 0.98 }}
            >
              {`${add ? "Create Task" : "Save Changes"}`}
            </motion.button>
        </section>
      </motion.div>
    </Backdrop>
  )
}
export default TaskAdd

type typeSubtask = {
  text: string,
  placeholder: string
}

function Subtask( {data} : {data: typeSubtask}) {
  return (
    <div className="taskadd__-text">
      <textarea spellCheck={false}
        placeholder={data.placeholder}
        defaultValue = {data.text}
      />
      <div className="taskadd__delete">
        <img src={crossIcon} alt="delete" />
      </div>
    </div>
  )
}