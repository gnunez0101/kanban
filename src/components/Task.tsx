import './Task.css'

function Task({task} : {task: any}) {

  const countSubTasks = task.subtasks.length
  const countCompleted = task.subtasks.filter((c: any) => c.isCompleted).length

  return (
    <section className="task">
      <div className="task-title">{task.title}</div>
      <div className="subtasks">
        {`${countCompleted} of ${countSubTasks} subtasks`}
      </div>
    </section>
  );
}
export default Task;