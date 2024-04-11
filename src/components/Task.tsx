import './Task.css'
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import useDialogs  from '../hooks/useDialogs'
import useDatabase from '../hooks/useDatabase';

function Task({board, column, task} : {board: number, column: number, task: number}) {
  const { database }     = useDatabase()
  const { dialogLaunch } = useDialogs() 
  
  const taskData    = database.boards[board].columns[column].tasks[task]
  const subTaskData = taskData.subtasks
  const completed    = useMemo(() => { return subTaskData.filter((c: any) => c.isCompleted).length }, [board, column, task])
  const subTaskCount = subTaskData.length

  return (
    <motion.section className = "task"
      initial    = {{ scale: 1}}
      whileHover = {{ scale: [1.05, 1, 1.02], transition: {duration: 0.5} }}
      whileTap   = {{ scale: 0.98 }}
      onClick    = { () => dialogLaunch("taskView", board, column, task) }
    >
      <div className="task-title">{taskData.title}</div>
      <div className="subtasks">
        {`${completed} of ${subTaskCount} subtasks`}
      </div>
    </motion.section>
  );
}
export default Task;