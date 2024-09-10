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

  function handleDragStart( e: any, coord: [board: number, column: number, task: number]  ) {
    const taskCoord = coord.join('|')
    e.dataTransfer.setData("taskCoord", taskCoord)
    e.target.classList.add("dragging")
  }

  function handleDragOver( e: any ) {
    e.preventDefault()
    showIndicator(e)
    setActive(true)
  }

  function handleDragLeave() {
    clearIndicators()
    setActive(false)
  }

  function handleDragEnd(e: any) {
    const taskCoord = e.dataTransfer.getData("taskCoord")
    e.target.classList.remove("dragging")
    setActive(false)
    clearIndicators()


    
  }

  function clearIndicators(els?: HTMLElement[]) {
    const indicators = els || getIndicators()

    indicators.forEach((i) => {
      i.style.opacity = "0"
    })
  }

  function showIndicator(e: any) {
    const indicators = getIndicators()
    clearIndicators(indicators)
    const el = getNearestIndicator(e, indicators)
    el.element.style.opacity = "1"
  }

  function getNearestIndicator(e: any, indicators: HTMLElement[]) {
    const DIST_OFFSET = 50

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = e.clientY - (box.top + DIST_OFFSET)
        if(offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        }
        else {
          return closest
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1]
      }
    )
    return el
  }

  function getIndicators() {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`) as unknown as HTMLElement[]
    )
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
          handleDragStart = {(e: any) => handleDragStart(e, [board, column, index])}
          handleDragEnd   = { handleDragEnd }
        />
      )}
      <DropIndicator beforeId={null} column={column} />
    </motion.section>
  )
}
export default Column;