import './BoardDelete.css'
import DialogModal from "./DialogModal";
import { Button } from "./Button";
import useDialogs  from "../hooks/useDialogs";
import useDatabase from '../hooks/useDatabase';

export function BoardDelete( { board } : { board?: number } ) {
  const { dialogLaunch } = useDialogs()
  const { database } = useDatabase()

  const boardName = database.boards[board!].name

  return (
    <DialogModal>
      <section className="boarddelete_dialog--title">
        Delete this board?
      </section>
      <section className="boarddelete__dialog--description">
        {`Are you sure you want to delete the ‘${boardName}’ board? This action will remove all columns and tasks and cannot be reversed.`}
      </section>
      <section className="boarddelete__dialog--buttons">
        <Button className="boarddelete__btn-delete"
          onClick = { () => dialogLaunch("delete", board, 0, 0) }
        >Delete</Button>
        <Button className="boarddelete__btn-cancel"
          onClick = { () => dialogLaunch("cancel", board, 0, 0) }
        >Cancel</Button>
      </section>
    </DialogModal>
  )
}