import { motion } from 'framer-motion';
import './Task.css'

function Task({task} : {task: any}) {

  const countSubTasks = task.subtasks.length
  const countCompleted = task.subtasks.filter((c: any) => c.isCompleted).length

  return (
    <motion.section className="task"
      initial = {{ scale: 1}}
      whileHover = {{ scale: [1.05, 1, 1.02], transition: {duration: 0.5} }}
      whileTap   = {{ scale: 0.98 }}
    >
      <div className="task-title">{task.title}</div>
      <div className="subtasks">
        {`${countCompleted} of ${countSubTasks} subtasks`}
      </div>
    </motion.section>
  );
}
export default Task;