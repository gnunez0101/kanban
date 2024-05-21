import DialogModal from "./DialogModal";
import useDatabase from "../hooks/useDatabase";
import useDialogs  from "../hooks/useDialogs";
import { Button } from "./Button";


export function BoardDelete( { board, column, task } : {board?: number, column?: number, task?: number} ) {
  const { database } = useDatabase()
  const { dialogLaunch, dialogsData } = useDialogs()

  function closeDialog() {
    dialogLaunch("close", board, column, task)
  }
  
  return (
    <DialogModal onClick={closeDialog}>
      <section className="boarddelete_dialog--title">
        Delete this board?
      </section>
      <section className="boarddelete__dialog--description">
        {`Are you sure you want to delete the ‘Platform Launch’ board? This action will remove all columns and tasks and cannot be reversed.`}
      </section>
      <Button className="boarddelete__btn-delete">Delete</Button>
      <Button className="boarddelete__bnt-cancel">Cancel</Button>
    </DialogModal>
  )
}