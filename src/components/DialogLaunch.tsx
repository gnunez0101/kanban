import { AnimatePresence } from "framer-motion"
import { BoardAdd } from "./BoardAdd"
import TaskAdd  from "./TaskAdd"
import TaskView from "./TaskView"

type typeDialogs = [
  string,   // [0]: dialog name
  number?,  // [1]: board number
  number?,  // [2]: columns number
  number?   // [3]: task number
]

function DialogLaunch( { data }: { data: typeDialogs } ) {
  // console.log("Data:", data)
  return (
    <AnimatePresence mode="wait">
      { data[0] == 'taskView'  && <TaskView board={data[1]} column={data[2]} task={data[3]} /> }
      { data[0] == 'taskAdd'   && <TaskAdd  board={data[1]} add={true}/> }
      { data[0] == 'boardAdd'  && <BoardAdd /> }
      { data[0] == 'boardEdit' && <BoardAdd edit = {true} /> }
    </AnimatePresence>
  )
}
export default DialogLaunch