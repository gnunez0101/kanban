import './TaskDelete.css'
import DialogModal from "./DialogModal";
import { Button } from "./Button";
import useDialogs  from "../hooks/useDialogs";
import useDatabase from '../hooks/useDatabase';

export function TaskDelete( { board, column, task } : { board?: number, column?: number, task?: number } ) {
  const { dialogLaunch } = useDialogs()
  const { database } = useDatabase()

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
          onClick = { () => dialogLaunch("delete", board, 0, 0) }
        >Delete</Button>
        <Button className="taskdelete__btn-cancel"
          onClick = { () => dialogLaunch("cancel", board, 0, 0) }
        >Cancel</Button>
      </section>
    </DialogModal>
  )
}