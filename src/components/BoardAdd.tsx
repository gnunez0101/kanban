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
    <DialogModal>
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
          <LayoutGroup>
          <AnimatePresence>
            { tempColumns.length ? (
              tempColumns.map((column: typeColumns, index: number) => 
                <motion.div className='boardadd__column--body' key={column.id}
                  layout     = {true}
                  initial    = {{ opacity: 0, scale: 0   }}
                  animate    = {{ opacity: 1, scale: 1, 
                    transition: {type: "spring", damping: 20, stiffness: 250} }}
                  exit       = {{ opacity: 0, scale: 0.3 }}
                  transition = {{ duration: 0.3 }}
                >
                  <input className="boardadd__column--name" type="text" 
                    defaultValue={column.name}
                  />
                  <div   className="boardadd__column--delete"
                    onClick={() => deleteColumn(index)}
                  />
                </motion.div>
              )) : <motion.div><h1 className='no-columns'>No columns!</h1></motion.div>
            }
          </AnimatePresence>
          </LayoutGroup>
          <Button className="boardadd__btn-addcol secondary"
            onClick={addColumn}
          >+ Add New Column
          </Button>
        </div>
      </section>
      <Button className="boardadd__btn-createboard primary"
        onClick={createBoard}
      >{`${edit ? "Save Changes" : "Create New Board"}`}
      </Button>
    </DialogModal>
  )
}
