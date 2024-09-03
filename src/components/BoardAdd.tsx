import './BoardAdd.css'
import './types'
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import DialogModal   from "./DialogModal";
import useDatabase from '../hooks/useDatabase';
import useDialogs  from "../hooks/useDialogs";

type typeTempColumn = {
  id:   number,
  name: string,
  isEmpty: boolean,
  tasks: typeTask[]
}

export function BoardAdd ( { edit = false }: { edit?: boolean } ) {
  const { database, dispatch } = useDatabase()
  const { dialogLaunch, dialogsData } = useDialogs()
  const [boardName, setBoardName] = useState("")
  const [board, setBoard] = useState(-1)
  
  const [tempColumns, setTempColumns] = useState<typeTempColumn[]>([])
  const defaultColumns = [
    {"id": 0, "name": "Todo" , isEmpty: false, tasks: [] }, 
    {"id": 1, "name": "Doing", isEmpty: false, tasks: [] }
  ]
  const [counter, setCounter] = useState(edit ? 0 : defaultColumns.length)

  const [nameError, setNameError] = useState(false)

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      var _board = -1
      if(dialogsData![1] !== undefined) { 
        _board = dialogsData![1]
        setBoard(_board)
        if(edit) {
          setBoardName(database.boards[_board].name)
          if (database.boards[_board].columns.length) {
            let count = counter
            setTempColumns(database.boards[_board].columns.map(column => {
              return( {id: count++, name: column.name, isEmpty: false, tasks: [...column.tasks]} )
            }))
            setCounter(count)
          }
          else {
            setTempColumns(defaultColumns)
            setCounter(defaultColumns.length)
          }
        }
        else {
          setTempColumns(defaultColumns)
        }
      }
    }
  }, [])

  function addColumn() {
    setTempColumns([...tempColumns, 
      {id: counter, name: `New column ${counter}...`, isEmpty: false, tasks: []}])
    setCounter(counter + 1)
  }

  function deleteColumn(index: number) {
    const _tempColumns = tempColumns
    _tempColumns.splice(index, 1)
    setTempColumns([..._tempColumns])
  }

  function handleChange_Name(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setBoardName(e.target.value)
    setNameError(e.target.value.trim() === "")  // if input is empty
  }

  function createBoard() {
    dialogLaunch("createBoard", dialogsData!.length + 1, 0, 0)
  }

  function handleChange_Column(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    e.preventDefault()
    const _tempColumns: typeTempColumn[] = JSON.parse(JSON.stringify(tempColumns))
    _tempColumns[index].name = e.target.value
    _tempColumns[index].isEmpty = ( e.target.value.length === 0 )
    setTempColumns(_tempColumns)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    var emptyError = false

    // Empty Name Validation:
    if (boardName.trim().length === 0) { setNameError(true); emptyError = true }

    // No Columns Validation:
    if (tempColumns.length === 0 ) return
    
    // Empty Column Validation:
    const _tempColumns: typeTempColumn[] = JSON.parse(JSON.stringify(tempColumns))
    for(let i = 0; i < _tempColumns.length; i++) {
      if (_tempColumns[i].name.trim().length === 0) {
        emptyError = true
        _tempColumns[i].isEmpty = true
      }
    }
    setTempColumns(_tempColumns)
    
    if (emptyError) return

    // Converting tempColumns to Columns:
    const _columns: typeColumn[] = tempColumns.map( ( column: typeTempColumn ) => (
      { name: column.name, tasks: [...column.tasks] }
    ))

    // Constructing Board object:
    const boardData: typeBoard = {
      name: boardName,
      columns: [..._columns]
    }

    // Writing values to database:
    // ====================================================================================================
    if ( edit ) {
      // Modify an existing Board:
      dialogLaunch("saveBoard", dialogsData![1])
      // Save changes on current Board:
      dispatch({ type: "board_Modify", coord: [board], values: boardData })
    }
    else {
      // Create a New Board:
      dialogLaunch("createBoard", board + 1)
      dispatch({ type: "board_Add", coord: [board + 1], values: boardData })
    }
  }
  
  return (
    <DialogModal>

      <section className="boardadd__dialog--title">
        {`${edit ? "Edit Board" : "Add New Board"}`}
      </section>

      <form onSubmit={handleSubmit} className='boardadd__form'>

        <section className="boardadd__name">
          <div className="boardadd__-title">Board Name</div>
          <div className = { `boardadd__name--text ${nameError ? "error" : ""}` }>
            <input type="text" className = "boardadd__name--input"
              placeholder='e.g. Web Design'
              defaultValue={boardName}
              onChange={handleChange_Name}
            />
            <div className="inputError">Can't be empty</div>
          </div>
        </section>

        <section className="boardadd__columns">
          <div className="boardadd__-title">Board Columns</div>
          <div className="boardadd__columns--items">
            <LayoutGroup>
            <AnimatePresence>
              { tempColumns.length ? (
                tempColumns.map((column: typeTempColumn, index: number) => 
                  <Column index={index} key={column.id}
                          defaultValue = {column.name}
                          placeholder  = "Add a column name..."
                          handleChange = {(e) => handleChange_Column(e, index)}
                          deleteColumn = {() => deleteColumn(index)}
                          isEmpty      = {column.isEmpty}
                  />
                )) : <motion.div className='no-columns'>No columns!</motion.div>
              }
            </AnimatePresence>
            </LayoutGroup>
            <Button className="boardadd__btn-addcol secondary" type="button"
              onClick={addColumn}
            >+ Add New Column
            </Button>
          </div>
        </section>

        <Button className="boardadd__btn-createboard primary"
          // onClick={createBoard}
        >{`${edit ? "Save Changes" : "Create New Board"}`}
        </Button>

      </form>
    </DialogModal>
  )
}

type typePropsColumn = {
  index: number,
  defaultValue: string, 
  placeholder: string, 
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void, 
  deleteColumn: (index: number) => void,
  isEmpty: boolean
}

function Column( props: typePropsColumn ) {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    props.handleChange(e, index)
  }

  return (
    <motion.div className = { `boardadd__name--text ${ props.isEmpty ? "error" : ""}` }
      layout     = {true}
      initial    = {{ opacity: 0, scale: 0   }}
      animate    = {{ opacity: 1, scale: 1, 
        transition: {type: "spring", damping: 20, stiffness: 250} }}
      exit       = {{ opacity: 0, scale: 0.3 }}
      transition = {{ duration: 0.3 }}
    >
      <input className="boardadd__name--input" type="text" 
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        onChange={(e) => handleChange(e, props.index)}
      />
      <div   className="boardadd__column--delete"
        onClick={() => props.deleteColumn(props.index)}
      />
      <div className = "inputError">Can't be empty</div>
    </motion.div>
  )
}