import './TaskDelete.css'
import DialogModal from "./DialogModal";
import { Button } from "./Button";
import useDialogs  from "../hooks/useDialogs";
import useDatabase from '../hooks/useDatabase';

export function TaskDelete( { board, column, task } : { board?: number, column?: number, task?: number } ) {
  const { dialogLaunch } = useDialogs()
  const { database, dispatch } = useDatabase()

  if (!database.boards[board!].columns[column!].tasks[task!]) return
  
  const taskTitle = database.boards[board!].columns[column!].tasks[task!].title
  
  return (
    <DialogModal>
      <section className="taskdelete_dialog--title">
        Delete this task?
      </section>
      <section className="taskdelete__dialog--description">
        {`Are you sure you want to delete the ‘${taskTitle}’ task and its subtasks? This action cannot be reversed.`}
      </section>
      <section className="taskdelete__dialog--buttons">
        <Button className="taskdelete__btn-delete"
          onClick = { () => {
            dialogLaunch("delete", board, column, task)
            dispatch({ type: "task_Delete", coord: [board!, column!, task!] })
          }}
        >Delete</Button>
        <Button className="taskdelete__btn-cancel"
          onClick = { () => dialogLaunch("taskView", board, column, task)  }
        >Cancel</Button>
      </section>
    </DialogModal>
  )
}