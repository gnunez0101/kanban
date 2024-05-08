import './BoardAdd.css'
import Backdrop   from "./Backdrop";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import useDatabase from '../hooks/useDatabase';
import useDialogs  from "../hooks/useDialogs";
import crossIcon from '../assets/icon-cross.svg'


export function BoardAdd ( { add }: { add: boolean } ) {
  const [columns, setColumns] = useState(null)
  const { database } = useDatabase()
  const { dialogLaunch, dialogsData } = useDialogs()

  const defaultColumns = ["Todo", "Doing"]

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      // let cols = database.boards[board!].columns.map((column: any) => {
      //   return { value: column.name, label: column.name }
      // })
      // setColumns(cols)
    }
  }, [])

  function closeDialog() {
    dialogLaunch("close", dialogsData[1], 0, 0)
  }

  const dialogVariant = {
    hide: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { type: "spring", damping: 22, stiffness: 700 }  },
    exit: { scale: 0, opacity: 0, transition: { ease: "backOut" } },
  }

  return (
    <Backdrop onClick={closeDialog}>
      <motion.div className="boardadd"
        onClick  = {(e) => e.stopPropagation()}
        variants = {dialogVariant}
        initial  = "hide"
        animate  = "show"
        exit     = "exit"
      >
        <section className="boardadd__dialog--title">
          {`${add ? "Add New Board" : "Edit Board"}`}
        </section>
        <section className="boardadd__name">
          <div className="boardadd__name--title">Board Name</div>
          <input type="text" className="boardadd__name--input" 
            placeholder='e.g. Web Design'
          />
        </section>

        <section className="boardadd__columns">
          <div className="boardadd__columns--title">Board Columns</div>
          <div className="boardadd__columns--items">
            { defaultColumns.map((column: string, index: number) => 
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

      </motion.div>
    </Backdrop>
  )
}

function Column( { name }: { name: string } ) {
  const [columnInput, setColumnInput] = useState("")
  return (
    <div className='boardadd__column--body'>
      <input type="text" className="boardadd__column--name" defaultValue={name}/>
      <div className="boardadd__column--delete">
        <img src={crossIcon} alt="delete" />
      </div>
    </div>
  )
}