import { motion } from 'framer-motion';
import './Task.css'
import { useContext } from 'react';
import { ContextDialogs } from './Store';

function Task({board, column, task, taskPos} : {board: number, column: number, task: any, taskPos: number}) {

  const setDialog = useContext(ContextDialogs)
  
  const countSubTasks = task.subtasks.length
  const countCompleted = task.subtasks.filter((c: any) => c.isCompleted).length

  return (
    <motion.section className = "task"
      initial    = {{ scale: 1}}
      whileHover = {{ scale: [1.05, 1, 1.02], transition: {duration: 0.5} }}
      whileTap   = {{ scale: 0.98 }}
      onClick    = { () => {
        setDialog("task", board, column, taskPos)
      }}
    >
      <div className="task-title">{task.title}</div>
      <div className="subtasks">
        {`${countCompleted} of ${countSubTasks} subtasks`}
      </div>
    </motion.section>
  );
}
export default Task;