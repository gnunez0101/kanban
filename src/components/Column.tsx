import './Column.css'
import Task from './Task'

function Column({board, column, pos} : {board: number, column: any, pos: number}) {
  const count = column.tasks.length

  const colors = [ "#49C4E5", "#8471F2", "#67E2AE" ]
  let colorIndex = pos
  // Asign available colors in circular direction:
  if ( colorIndex > colors.length - 1 ) {
    let x = 0
    for ( let i = 0 ; i <= pos ; i++ ) {
      if ( i > colors.length - 1 ) x = 0
      else x++
    }
    colorIndex = x
  }

  return (
    <section className="column">
      <div className="column-name">
        <span className="bullet" style={{backgroundColor: colors[colorIndex]}}></span>
        <span className="text">{`${column.name} (${count})`}</span>
      </div>
      { column.tasks.map( (item: any, index: number) => 
        <Task board = {board} column = {pos} task = {item} taskPos={index} key={index} />
      )}
    </section>
  );
}
export default Column;