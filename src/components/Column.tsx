import './Column.css'
import Task from './Task'
import useDatabase from '../hooks/useDatabase'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function Column({ board, column } : {board: number, column: number }) {
  const { database } = useDatabase()
  const [taskCount, setTaskCount]   = useState(0)
  const [columnName, setColumnName] = useState("")

  useEffect(() => {
    setTaskCount(database.boards[board].columns[column].tasks.length)
    setColumnName(database.boards[board].columns[column].name)
  }, [])

  useEffect(() => {
    setTaskCount(database.boards[board].columns[column].tasks.length)
    setColumnName(database.boards[board].columns[column].name)
  }, [taskCount, columnName])

  const colors = [ "#49C4E5", "#8471F2", "#67E2AE" ]
  let colorIndex = column
  
  // Asign available colors in circular direction:
  if ( colorIndex > colors.length - 1 ) {
    let x = 0
    for ( let i = 0 ; i <= column ; i++ ) x = ( i > colors.length - 1 ) ? 0 : x + 1
    colorIndex = x
  }

  // console.log("Board/Columna:", board, column)

  return (
    <motion.section className="column"
      initial    = "initial"
      animate    = "animate"
      transition = {{ staggerChildren: 0.05 }}
    >
      <div className="column-name">
        <span className="bullet" style={{backgroundColor: colors[colorIndex]}}></span>
        <span className="text">{`${columnName} (${taskCount})`}</span>
      </div>
      { database.boards[board].columns[column].tasks.map( (_, index: number) => 
        <Task board={board} column={column} task={index} key={index} />
      )}
    </motion.section>
  )
}
export default Column;