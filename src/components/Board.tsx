import './Board.css'
import Column from './Column';
import EmptyColumns from './EmptyColumns';

function Board({board} : {board: any}) {

  return (
    <>
      { board.columns.length == 0 ?
        <EmptyColumns />
        :
        <section className="board">
          { board.columns.map( (item: any, index: number) => 
            <Column column = {item} pos={index} key={index}/>
          )}
          <section className="column new">
            <div className="backdrop"></div>
            <div className='text'>+ New Column</div>
          </section>
        </section>
      }
    </>
  );
}
export default Board;