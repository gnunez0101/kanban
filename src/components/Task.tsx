import './Task.css'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useDialogs  from '../hooks/useDialogs'
import useDatabase from '../hooks/useDatabase'

function Task( {board, column, task} : {board: number, column: number, task: number} ) {
  const { database }     = useDatabase()
  const { dialogLaunch, subtaskChange, setSubTaskChange } = useDialogs()
  
  const [countSubTaskCompleted, setCountSubTaskCompleted] = useState(0)
  const [countSubTaskTotal,     setCountSubTaskTotal]     = useState(0)

  const taskData = database.boards[board].columns[column].tasks[task]
  const subTasks = taskData.subtasks

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

  return (
    <motion.section className = "task"
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      whileHover = { { scale: [1.05, 1, 1.02], transition: {duration: 0.5} } }
      whileTap   = { { scale: 0.98 } }
      onClick    = { () => {
        dialogLaunch("taskView", board, column, task)
      }}
    >
      <div className = "task-title">{ database.boards[board].columns[column].tasks[task].title }</div>

      <div className = "subtasks">
        { `${countSubTaskCompleted} of ${countSubTaskTotal} subtasks` }
      </div>
    </motion.section>
  )
}
export default Task;