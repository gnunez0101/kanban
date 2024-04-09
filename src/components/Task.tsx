import { motion } from 'framer-motion';
import './Task.css'
import { useEffect, useState } from 'react';
import useDialogs  from '../hooks/useDialogs'
import useDatabase from '../hooks/useDatabase';

function Task({board, column, task} : {board: number, column: number, task: number}) {
  const { database }   = useDatabase()
  const { dialogTask } = useDialogs() 

  const [showDialog, setShowDialog] = useState(false)

  const taskData = database.boards[board].columns[column].tasks[task]
  const countSubTasks  = taskData.subtasks.length
  const countCompleted = taskData.subtasks.filter((c: any) => c.isCompleted).length

  useEffect(() => {
    if (showDialog) {
      dialogTask(board, column, task, showDialog)
      setShowDialog(false)
    }
  }, [showDialog])

  return (
    <motion.section className = "task"
      initial    = {{ scale: 1}}
      whileHover = {{ scale: [1.05, 1, 1.02], transition: {duration: 0.5} }}
      whileTap   = {{ scale: 0.98 }}
      onClick    = { () => setShowDialog(true) }
    >
      <div className="task-title">{taskData.title}</div>
      <div className="subtasks">
        {`${countCompleted} of ${countSubTasks} subtasks`}
      </div>
    </motion.section>
  );
}
export default Task;