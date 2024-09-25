import './Task.css'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useDialogs  from '../hooks/useDialogs'
import useDatabase from '../hooks/useDatabase'
import { DropIndicator } from './DropIndicator'

function Task( {board, column, task, handleDragStart} : 
  {board: number, column: number, task: number, 
    handleDragStart: Function,
  } ) {
  const { database } = useDatabase()
  const { dialogLaunch, subtaskChange, setSubTaskChange } = useDialogs()
  
  const [countSubTaskCompleted, setCountSubTaskCompleted] = useState(0)
  const [countSubTaskTotal,     setCountSubTaskTotal]     = useState(0)

  const taskData = database.boards[board].columns[column].tasks[task]
  const subTasks = taskData ? taskData.subtasks : []

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      setSubTaskChange(true)
      firstTime = false
    }
  }, [])

  useEffect(() => {
    if(subtaskChange) {
      setCountSubTaskCompleted(subTasks.filter((c: any) => c.isCompleted).length)
      setCountSubTaskTotal(subTasks.length)
      setSubTaskChange(false)
    }
  }, [subtaskChange])

  if (!taskData) return  // When Task is deleted

  const variantTask = {
    init: { scale: 0.5, y: 50, opacity: 0 },
    show: { scale: 1,   y:  0, opacity: 1, transition: { duration: 1 } },
    hide: { scale: 0,   y: 50, opacity: 0, transition: { duration: 2 } }
  }

  function handleDrop(e: any) {
    e.target.classList.remove("dragging")
  }

  return (
    <>
      <DropIndicator beforeId={task} column={column}/>
      <motion.section className = "task"
        layout
        layoutId  = {taskData.id}
        draggable = "true"
        // variants = {variantTask}
        // initial  = "init"
        // animate  = "show"
        // exit     = "hide"
        initial     = { { scale: 1 } }
        whileHover  = { { scale: [1.05, 1, 1.02], transition: {duration: 0.5} } }
        whileTap    = { { scale: 0.98 } }
        onClick     = { () => {dialogLaunch("taskView", board, column, task)} }
        onDragStart = { (e) => handleDragStart(e, [board, column, task]) }
        onDragEnd   = { handleDrop }
      >
        <div className = "task-title">{ database.boards[board].columns[column].tasks[task].title }</div>
        <div className = "subtasks">
          { `[${taskData.id}] ${countSubTaskCompleted} of ${countSubTaskTotal} subtasks` }
        </div>
      </motion.section>
    </>
  )
}
export default Task