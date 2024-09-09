import './Column.css'
import Task from './Task'
import useDatabase from '../hooks/useDatabase'
import { motion } from 'framer-motion'
import { DropIndicator } from './DropIndicator'
import { useState } from 'react'

function Column({ board, column } : {board: number, column: number }) {
  const { database } = useDatabase()
  const [active, setActive] = useState(false)
  
  const colors = [ "#49C4E5", "#8471F2", "#67E2AE" ]
  let colorIndex = column
  
  // Asign available colors in circular direction:
  if ( colorIndex > colors.length - 1 ) {
    let x = 0
    for ( let i = 0 ; i <= column ; i++ ) x = ( i > colors.length - 1 ) ? 0 : x + 1
    colorIndex = x
  }

  function handleDragStart( e: DragEvent, board: number, column: number, task: number ) {
    e.target.classList.add("dragging")
  }

  function handleDragOver( e: any ) {
    e.preventDefault()
    setActive(true)
  }

  function handleDragLeave() {
    setActive(false)
  }

  function handleDragEnd(e: any) {
    e.target.classList.remove("dragging")
    setActive(false)
  }

  return (
    <motion.section className = {`column ${active ? "active" : ""}`}
      layout layoutId={`${column}`}
      initial    = {{ scaleY: 0, opacity: 0 }}
      animate    = {{ scaleY: 1, opacity: 1, 
                      transition: { 
                        staggerChildren: 0 } }}
      // transition = {{ staggerChildren: 0.05 }}
      onDragOver  = { (e) => handleDragOver(e) }
      onDragLeave = { handleDragLeave }
      onDrop      = { handleDragEnd }
    >
      <div className="column-name">
        <span className="bullet" style={{backgroundColor: colors[colorIndex]}}></span>
        <span className="text">{`${database.boards[board].columns[column].name} (${database.boards[board].columns[column].tasks.length})`}</span>
      </div>
      { database.boards[board].columns[column].tasks.map( (_, index: number) => 
        <Task board={board} column={column} task={index} key={index} 
          handleDragStart = {(e) => handleDragStart(e, board, column, index)}
        />
      )}
      <DropIndicator beforeId={null} column={column} />
    </motion.section>
  )
}
export default Column;