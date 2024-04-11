import TaskAdd from "./TaskAdd"
import TaskView from "./TaskView"

type typeDialogs = [string, number, number, number]

function DialogLaunch( { data }: { data: typeDialogs } ) {

  return (
    <>
      { data[0] == 'taskView' && <TaskView board={data[1]} column={data[2]} task={data[3]} /> }
      { data[0] == 'taskAdd'  && <TaskAdd  board={data[1]} column={data[2]} /> }
    </>
  )
}
export default DialogLaunch