import { useRef, useState } from 'react';
import { Checkbox } from './Toggle';
import './TaskView.css'
import ellipsis from '../assets/icon-vertical-ellipsis.svg'
import Select from 'react-select';
import { motion } from 'framer-motion';
import useDatabase from '../hooks/useDatabase';

function TaskView( { board, column, task, showModal }: { board: number, column: number, task: number, showModal: boolean } ) {

  const { database } = useDatabase()

  const taskData = database.boards[board].columns[column].tasks[task]
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)

  const showTaskViewRef = useRef<HTMLDialogElement>(null)

  const columns = database.boards[board].columns.map((column: any) => {
    return { value: column.name, label: column.name }
  })

  if (showModal) showTaskViewRef.current?.showModal()
  else showTaskViewRef.current?.close()

  const countCompleted = taskData.subtasks.filter((c: any) => c.isCompleted).length

  return (
    <dialog className="taskview" ref={showTaskViewRef} onClick={() => setShowMenu(false)}>
      <section className="taskview__title">
        <textarea className="taskview__title--text" spellCheck={false}
          placeholder='Write a title...'
          readOnly = {!editing}
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
          { showMenu && 
            <motion.div className="taskview__title--ellipsis-menu"
              initial = {{ scaleY: 0 }}
              animate = {{ scaleY: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="taskview__title--ellipsis-menu__option edit"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditing(true)
                  setShowMenu(false)
                }}
              >Edit Task
              </div>
              <div className="taskview__title--ellipsis-menu__option delete"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                }}
              >Delete Task</div>
            </motion.div>
          }
        </div>
      </section>
      <div className="taskview__description">
        <textarea spellCheck={false}
          placeholder='Write a description...'
          readOnly = {!editing} 
          defaultValue = {taskData.description}
        />
      </div>
      <section className="taskview__subtasks">
        <div className="taskview__subtasks--title">
          Subtasks {`(${countCompleted} of ${taskData.subtasks.length})`}
        </div>
        <div className="taskview__subtasks--items">
          { taskData.subtasks.map((subtask: any, index: number) => 
            <div className={`taskview__subtasks--items__subtask ${editing ? "edit" : ""}`} key={index}>
              <Checkbox className="taskview__subtasks--items__completed"
                checked  = { subtask.isCompleted }
                readOnly = { !editing }
              />
              <p className="taskview__subtasks--items__title">{subtask.title}</p>
            </div>
          )}
        </div>
      </section>
      <section className="taskview__current-status">
        <div className="taskview__current-status--title">
          Current Status
        </div>
        <div className="taskview__current-status--items">
          <Select options={columns} isDisabled={!editing}
            className='taskview__current-status-select' 
            classNamePrefix="taskview__current-status-select" 
            value={{ value: taskData.status, label: taskData.status }}
          />
        </div>
      </section>
    </dialog>
  )
}
export default TaskView;