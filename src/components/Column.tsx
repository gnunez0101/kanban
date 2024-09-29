import './Column.css'
import Task from './Task'
import useDatabase from '../hooks/useDatabase'
import { DropIndicator } from './DropIndicator'
import { useState } from 'react'

function Column({ board, column } : {board: number, column: number }) {
  const { database, dispatch } = useDatabase()
  const [active, setActive] = useState(false)
  
  const colors = [ "#49C4E5", "#8471F2", "#67E2AE" ]
  let colorIndex = column
  
  // Asign available colors in circular direction:
  if ( colorIndex > colors.length - 1 ) {
    let x = 0
    for ( let i = 0 ; i <= column ; i++ ) x = ( i > colors.length - 1 ) ? 0 : x + 1
    colorIndex = x
  }

  function handleDragStart(e: any, coord: [board: number, column: number, task: number]) {
    e.dataTransfer.setData("taskCoord", coord.join('|'))
    e.dataTransfer.effectAllowed = "move"
    e.target.classList.add("dragging")
  }

  function handleDragOver(e: any) {
    e.preventDefault()
    showIndicator(e)
    setActive(true)
  }

  function handleDragLeave() {
    clearIndicators()
    setActive(false)
  }

  function handleDragEnd(e: any) {
    const taskCoordOri = e.dataTransfer.getData("taskCoord").split('|')
    setActive(false)
    clearIndicators()
    
    if (taskCoordOri.length === 1) return   // If there's any problem with dataTransfer

    const indicators  = getIndicators()
    const { element } = getNearestIndicator(e, indicators)

    const board      = taskCoordOri[0]
    const columnOri  = taskCoordOri[1]
    const columnDest = element.dataset.column
    const taskOri    = taskCoordOri[2]
    let   taskDest   = element.dataset.before!

    if ( columnOri != columnDest || 
       ( columnOri === columnDest && (taskDest < taskOri || taskDest > (parseInt(taskOri)+1).toString()) ) ) {
        if ( columnDest === columnOri && taskDest > taskOri ) {
          taskDest = (parseInt(taskDest) - 1).toString()
        }
      dispatch({ type: 'task_Move', from: [board, columnOri, taskOri], to: [board, columnDest, taskDest] })
    }
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

  const tasks = database.boards[board].columns[column].tasks.length
  const name  = database.boards[board].columns[column].name
  
  return (
    <div className = "column">
      <div className="column-name">
        <span className="bullet" style={{backgroundColor: colors[colorIndex]}}></span>
        <span className="text">{`${name} (${tasks})`}</span>
      </div>
      <div className= {`column-items ${active ? "active" : ""}`}
        onDragOver  = { handleDragOver }
        onDragLeave = { handleDragLeave }
        onDrop      = { handleDragEnd }
      >
        { database.boards[board].columns[column].tasks.map( (_task: typeTask, index: number) => 
          <Task board={board} column={column} task={index} key={_task.id}
            handleDragStart = {handleDragStart}
          />
        )}
        <DropIndicator beforeId={tasks} column={column} />
      </div>
    </div>
  )
}
export default Column;