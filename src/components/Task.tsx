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

  function handleDrop(e: any) {
    e.target.classList.remove("dragging")
  }

  return (
    <>
      <DropIndicator beforeId={task} column={column}/>
      <motion.div className = "task"
        layout
        layoutId   = {taskData.id}
        draggable  = "true"
        initial     = { { scale: 1 } }
        whileHover  = { { scale: [1.05, 1, 1.02], transition: {duration: 0.5} } }
        whileTap    = { { scale: 0.98 } }
        onClick     = { () => {dialogLaunch("taskView", board, column, task)} }
        onDragStart = { (e) => handleDragStart(e, [board, column, task]) }
        onDragEnd   = { handleDrop }
      >
        <div className = "task-title">{ database.boards[board].columns[column].tasks[task].title }</div>
        <div className = "subtasks">
          { `${countSubTaskCompleted} of ${countSubTaskTotal} subtasks` }
        </div>
      </motion.div>
    </>
  )
}
export default Task