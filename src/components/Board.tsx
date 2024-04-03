import { motion } from 'framer-motion';
import './Board.css'
import Column from './Column';
import EmptyColumns from './EmptyColumns';
import useDatabase from '../hooks/useDatabase';

function Board({board} : {board: number}) {
  const { database } = useDatabase()

  return (
    <>
      { database.boards[board].columns.length == 0 ?
        <EmptyColumns />
        :
        <section className="board">
          { database.boards[board].columns.map( (item: any, index: number) => 
            <Column board = {board} column = {index} key={index}/>
          )}
          <motion.section className="column new"
            initial = {{ scale: 1}}
            whileHover = {{ scale: [1.04, 1, 1.02], transition: {duration: 0.5} }}
            whileTap   = {{ scale: 0.98 }}
          >
            <div className="backdrop"></div>
            <div className='text'>+ New Column</div>
          </motion.section>
        </section>
      }
    </>
  );
}
export default Board;