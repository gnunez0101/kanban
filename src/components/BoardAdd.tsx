import './BoardAdd.css'
import DialogModal   from "./DialogModal";
import { Button } from "./Button";
import { useEffect, useId, useState } from "react";
import useDatabase from '../hooks/useDatabase';
import useDialogs  from "../hooks/useDialogs";
import { AnimatePresence, motion } from 'framer-motion';

type typeColumns = {
  id: string,
  name: string
}

export function BoardAdd ( { edit = false }: { edit?: boolean } ) {
  const [columns, setColumns] = useState(null)
  const { database } = useDatabase()
  const { dialogLaunch, dialogsData } = useDialogs()
  const [boardName, setBoardName] = useState("")
  const [counter, setCounter] = useState(0)
  
  const [tempColumns, setTempColumns] = useState<typeColumns[]>([])
  const defaultColumns = [
    {"id": "00", "name": "Todo" }, 
    {"id": "11", "name": "Doing"}
  ]

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      if(edit) {
        const board = dialogsData[1]
        setBoardName(database.boards[board].name)
        if (database.boards[board].columns.length > 0)
          setTempColumns(database.boards[board].columns.map(column => {
            return( {id: useId(), name: column.name} )
          }))
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

  
  function addColumn() {
    setTempColumns([...tempColumns, 
      {id: counter.toString(), name: `New column ${tempColumns.length+1}...`}])
    setCounter(counter + 1)
  }

  function deleteColumn(index: number) {
    const _tempColumns = tempColumns
    _tempColumns.splice(index, 1)
    setTempColumns([..._tempColumns])
  }

  function createBoard() {
    dialogLaunch("createBoard", dialogsData.length + 1, 0, 0)
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
          <AnimatePresence mode='popLayout'>
            { tempColumns.length ? (
              tempColumns.map((column: typeColumns, index: number) => 
                <motion.div className='boardadd__column--body' key={column.id}
                  layout
                  initial={{ opacity: 0, x: -400, scale: 0.5 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 200, scale: 1.2 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <input className="boardadd__column--name" type="text" 
                    defaultValue={column.name}
                  />
                  <div   className="boardadd__column--delete"
                    onClick={() => deleteColumn(index)}
                  />
                </motion.div>
              )) : <div><h1 className='no-columns'>No columns!</h1></div>
            } 

          </AnimatePresence>
          <Button className="boardadd__btn-addcol secondary"
            onClick={addColumn}
          >+ Add New Column
          </Button>
        </div>
      </section>

      <Button className="boardadd__btn-createboard primary"
        onClick={createBoard}
      >
        Create New Board
      </Button>
    </DialogModal>
  )
}
