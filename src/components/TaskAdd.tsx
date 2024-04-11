import './TaskAdd.css'
function TaskAdd( { board, column }: { board: number, column: number } ) {
  return (
    <>
      Hola {board}, {column}
    </>
  )
}
export default TaskAdd