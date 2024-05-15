import './BoardAdd.css'
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import DialogModal   from "./DialogModal";
import useDatabase from '../hooks/useDatabase';
import useDialogs  from "../hooks/useDialogs";

type typeColumns = {
  id:   number,
  name: string
}

export function BoardAdd ( { edit = false }: { edit?: boolean } ) {
  const { database } = useDatabase()
  const { dialogLaunch, dialogsData } = useDialogs()
  const [boardName, setBoardName] = useState("")
  
  const [tempColumns, setTempColumns] = useState<typeColumns[]>([])
  const defaultColumns = [
    {"id": 0, "name": "Todo" }, 
    {"id": 1, "name": "Doing"}
  ]
  const [counter, setCounter] = useState(edit ? 0 : defaultColumns.length)

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      if(edit) {
        const board = dialogsData[1]
        setBoardName(database.boards[board].name)
        if (database.boards[board].columns.length) {
          let count = counter
          setTempColumns(database.boards[board].columns.map(column => {
            console.log(count)
            return( {id: count++, name: column.name} )
          }))
          setCounter(count)
        }
        else {
          setTempColumns(defaultColumns)
        }
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
      {id: counter, name: `New column ${counter}...`}])
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
                  initial = {{ opacity: 0, scale: 0 }}
                  animate = {{ opacity: 1, scale: 1   }}
                  exit    = {{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1, type: "spring" }}
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
        {`${edit ? "Save Changes" : "Create New Board"}`}
      </Button>
    </DialogModal>
  )
}
