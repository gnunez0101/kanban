import './BoardAdd.css'
import DialogModal   from "./DialogModal";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import useDatabase from '../hooks/useDatabase';
import useDialogs  from "../hooks/useDialogs";


export function BoardAdd ( { edit = false }: { edit?: boolean } ) {
  const [columns, setColumns] = useState(null)
  const { database } = useDatabase()
  const { dialogLaunch, dialogsData } = useDialogs()
  const [boardName, setBoardName] = useState("")
  const [tempColumns, setTempColumns] = useState<string[]>([])
  const defaultColumns = ["Todo", "Doing"]

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      if(edit) {
        const board = dialogsData[1]
        setBoardName(database.boards[board].name)
        if (database.boards[board].columns.length > 0)
          setTempColumns(database.boards[board].columns.map(column => column.name))
        else
          setTempColumns(defaultColumns)
      }
      else {
        setTempColumns(defaultColumns)
      }
    }
  }, [])

  function closeDialog() {
    dialogLaunch("close", dialogsData[1], 0, 0)
  }
  
  return (
    <DialogModal onClick={closeDialog}>
      <section className="boardadd__dialog--title">
        {`${edit ? "Edit Board" : "Add New Board"}`}
      </section>
      <section className="boardadd__name">
        <div className="boardadd__name--title">Board Name</div>
        <input type="text" className="boardadd__name--input"
          placeholder='e.g. Web Design'
          defaultValue={boardName}
        />
      </section>

      <section className="boardadd__columns">
        <div className="boardadd__columns--title">Board Columns</div>
        <div className="boardadd__columns--items">
          { tempColumns.map((column: string, index: number) => 
            <Column name={column} key={index} />
          )}
          <Button className="boardadd__btn-addcol secondary">
            + Add New Column
          </Button>
        </div>
      </section>

      <Button className="boardadd__btn-createboard primary">
        Create New Board
      </Button>
    </DialogModal>
  )
}

function Column( { name }: { name: string } ) {
  const [columnInput, setColumnInput] = useState("")
  return (
    <div className='boardadd__column--body'>
      <input className="boardadd__column--name" type="text" defaultValue={name}/>
      <div   className="boardadd__column--delete"></div>
    </div>
  )
}