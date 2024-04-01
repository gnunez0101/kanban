import { useRef, useState } from 'react';
import { Checkbox } from './Toggle';
import './TaskView.css'
import ellipsis    from '../assets/icon-vertical-ellipsis.svg'
import Select from 'react-select';
import { motion } from 'framer-motion';

function TaskView({ showModal } : { showModal: boolean }) {

  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)

  const showTaskViewRef = useRef<HTMLDialogElement>(null)

  const task = {
    "title": "Research pricing points of various competitors and trial different business models",
    "description": "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
    "status": "Doing",
    "subtasks": [
      {
        "title": "Research competitor pricing and business models",
        "isCompleted": true
      },
      {
        "title": "Outline a business model that works for our solution",
        "isCompleted": true
      },
      {
        "title": "Talk to potential customers about our proposed solution and ask for fair price expectancy",
        "isCompleted": false
      }
    ]
  }

  const columns = [
    { value: 'Todo',  label: 'Todo'  },
    { value: 'Doing', label: 'Doing' },
    { value: 'Done',  label: 'Done'  },
  ]

  if (showModal) showTaskViewRef.current?.showModal()
  else showTaskViewRef.current?.close()

  const countCompleted = task.subtasks.filter((c: any) => c.isCompleted).length

  return (
    <dialog className="taskview" ref={showTaskViewRef} onClick={() => setShowMenu(false)}>
      <section className="taskview__title">
        <textarea className="taskview__title--text" spellCheck={false} 
          readOnly = {!editing}
          defaultValue = {task.title}
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
          readOnly = {!editing} 
          defaultValue = {task.description}
        />
      </div>
      <section className="taskview__subtasks">
        <div className="taskview__subtasks--title">
          Subtasks {`(${countCompleted} of ${task.subtasks.length})`}
        </div>
        <div className="taskview__subtasks--items">
          { task.subtasks.map((subtask: any, index: number) => 
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
            value={{ value: task.status, label: task.status }}
          />
        </div>
      </section>
    </dialog>
  )
}
export default TaskView;