import { motion } from 'framer-motion';
import './Board.css'
import Column from './Column';
import EmptyColumns from './EmptyColumns';
import useDatabase from '../hooks/useDatabase';
import useDialogs  from '../hooks/useDialogs';

export default function Board() {
  const { database }                   = useDatabase()
  const { dialogLaunch, currentBoard } = useDialogs()

  return (
    <>
      { database.boards[currentBoard!].columns.length == 0 
        ?
        <EmptyColumns />
        :
        <section className="board">
          {/* Columns */}
          { database.boards[currentBoard!].columns.map( (_: any, index: number) => 
            <Column board = {currentBoard!} column = {index} key = {index}/>
          )}

          {/* New Column Add clickable area */}
          <motion.section className="column new"
            initial    = {{ scale: 1}}
            whileHover = {{ scale: [1.04, 1, 1.02], transition: {duration: 0.5} }}
            whileTap   = {{ scale: 0.98 }}
            onClick    = {() => dialogLaunch("boardEdit", currentBoard!, 0, 0)}
          >
            <div className="backdrop__new-column"></div>
            <div className='text'>+ New Column</div>
          </motion.section>
        </section>
      }
    </>
  );
}