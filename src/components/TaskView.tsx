import { useRef, useState } from 'react';
import './TaskView.css'
import ellipsis    from '../assets/icon-vertical-ellipsis.svg'
import Select from 'react-select';

function TaskView({ showModal } : { showModal: boolean }) {

  const [showViewModal, setShowViewModal] = useState(false)
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
        "isCompleted": false
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

  if(showModal) showTaskViewRef.current?.showModal()

  return (
    <dialog className="taskview" ref={showTaskViewRef}>
      <section className="taskview__title">
        <div className="taskview__title--text">
          {task.title}
        </div>
        <div className="taskview__title--ellipsis">
          <img src={ellipsis} alt="ellipsis" />
        </div>
      </section>
      <section className="taskview__description">
        {task.description}        
      </section>
      <section className="taskview__subtasks">
        <div className="taskview__subtasks--title">
          Subtasks {`(2 of ${task.subtasks.length})`}
        </div>
        <div className="taskview__subtasks--items">
          { task.subtasks.map((subtask: any, index: number) => 
            <div className="taskview__subtasks--items__subtask" key={index}>
              <input className="taskview__subtasks--items__completed" type="checkbox" value={subtask.isCompleted}/>
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
          <Select options={columns} classNamePrefix="taskview__current-status-select" />
        </div>
      </section>
    </dialog>
  )
}
export default TaskView;