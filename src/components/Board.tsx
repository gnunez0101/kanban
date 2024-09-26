import './Board.css'
import Column from './Column';
import EmptyColumns from './EmptyColumns';
import useDatabase from '../hooks/useDatabase';
import useDialogs  from '../hooks/useDialogs';
import { AnimatePresence, motion } from 'framer-motion';

export default function Board() {
  const { database }                   = useDatabase()
  const { dialogLaunch, currentBoard } = useDialogs()

  return (
    <>
      { database.boards[currentBoard!].columns.length == 0
        ?
        <EmptyColumns />
        :
        <AnimatePresence>
          <section className="board">

            {/* Columns */}
            { database.boards[currentBoard!].columns.map( (_: any, index: number) => 
              <Column board = {currentBoard!} column = {index} key = {index}/>
            )}

            {/* New Column Add clickable area */}
            <section className="column new" onClick = {() => dialogLaunch("boardEdit", currentBoard!, 0, 0)}>
              <div className="backdrop__new-column"></div>
              <motion.div className='text'
                initial    = {{ scale: 1 }}
                whileHover = {{ scale: [1.2, 1, 1.1, 1], transition: {duration: 0.5} }}
                whileTap   = {{ scale: 0.98 }}
              >+ New Column
              </motion.div>
            </section>

          </section>
        </AnimatePresence>
      }
    </>
  );
}