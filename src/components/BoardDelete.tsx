import './BoardDelete.css'
import DialogModal from "./DialogModal";
import { Button } from "./Button";
import useDialogs  from "../hooks/useDialogs";
import useDatabase from '../hooks/useDatabase';

export function BoardDelete( { board } : { board?: number } ) {
  const { dialogLaunch, setCurrentBoard } = useDialogs()
  const { database, dispatch } = useDatabase()

  if(database.boards[board!] === undefined) return
  
  const boardName = database.boards.length ? database.boards[board!].name : "No hay Board"

  return (
    <DialogModal>
      <div className="boarddelete_dialog--title">
        Delete this board?
      </div>
      <div className="boarddelete__dialog--description">
        {`Are you sure you want to delete the ‘${boardName}’ board? This action will remove all columns and tasks and cannot be reversed.`}
      </div>
      <div className="boarddelete__dialog--buttons">
        <Button className="boarddelete__btn-delete"
          onClick = { () => {
            dialogLaunch("delete", board, 0, 0)
            if(board == database.boards.length-1) setCurrentBoard(board-1)
            dispatch({ type: "board_Delete", coord: [board!] })
          }}
        >Delete</Button>
        <Button className="boarddelete__btn-cancel"
          onClick = { () => dialogLaunch("cancel", board, 0, 0)}
        >Cancel</Button>
      </div>
    </DialogModal>
  )
}