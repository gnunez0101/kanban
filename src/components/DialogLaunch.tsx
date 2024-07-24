import TaskAdd  from "./TaskAdd"
import TaskView from "./TaskView"
import { TaskDelete }  from "./TaskDelete"
import { BoardAdd }    from "./BoardAdd"
import { BoardDelete } from "./BoardDelete"
import { AnimatePresence } from "framer-motion" 

type typeDialogs = [
  command: string,   // [0]: dialog name or command
  board?:  number,   // [1]: board number
  column?: number,   // [2]: columns number
  task?:   number,   // [3]: task number
  callBack?: (param: any) => void, // [4]: callback function
]

function DialogLaunch( { data }: { data: typeDialogs } ) {
  // console.log("Data:", data)
  return (
    <AnimatePresence mode="wait">
      { data[0] == 'taskView'    && <TaskView board={data[1]} column={data[2]} task={data[3]} openWindow={data[4]!} /> }
      { data[0] == 'taskAdd'     && <TaskAdd /> }
      { data[0] == 'taskEdit'    && <TaskAdd edit={true}/> }
      { data[0] == 'boardAdd'    && <BoardAdd /> }
      { data[0] == 'boardEdit'   && <BoardAdd edit = {true} /> }
      { data[0] == 'boardDelete' && <BoardDelete board={data[1]} /> }
      { data[0] == 'taskDelete'  && <TaskDelete board={data[1]} column={data[2]} task={data[3]} /> }
    </AnimatePresence>
  )
}
export default DialogLaunch