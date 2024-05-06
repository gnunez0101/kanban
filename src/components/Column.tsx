import './Column.css'
import Task from './Task'
import useDatabase from '../hooks/useDatabase'
import { motion } from 'framer-motion'

function Column({ board, column } : {board: number, column: number }) {
  const { database } = useDatabase()
  const boardData = database.boards[board]
  const count = boardData.columns[column].tasks.length

  const colors = [ "#49C4E5", "#8471F2", "#67E2AE" ]
  let colorIndex = column
  // Asign available colors in circular direction:
  if ( colorIndex > colors.length - 1 ) {
    let x = 0
    for ( let i = 0 ; i <= column ; i++ ) {
      if ( i > colors.length - 1 ) x = 0
      else x++
    }
    colorIndex = x
  }

  return (
    <motion.section className="column"
      initial    = "initial"
      animate    = "animate"
      transition = {{ staggerChildren: 0.05 }}
    >
      <div className="column-name">
        <span className="bullet" style={{backgroundColor: colors[colorIndex]}}></span>
        <span className="text">{`${database.boards[board].columns[column].name} (${count})`}</span>
      </div>
      { boardData.columns[column].tasks.map( (item: any, index: number) => 
        <Task board={board} column={column} task={index} key={index} />
      )}
    </motion.section>
  )
}
export default Column;