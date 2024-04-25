import './EmptyDialogs.css'
import { motion } from 'framer-motion';

function EmptyBoards() {
  return ( 
    <>
      <div className="empty-container">
        <div className="empty-dialog">
          <p className="empty-text">
            There's no boards. Create a new board to get started.
          </p>
          <div className="button-container">
            <motion.button type="button"
              whileHover = {{ scale: [1, 1.1, 1, 1.05, 1] }}
              whileTap   = {{ scale: 0.9 }}
            >
              + Add New Board
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
export default EmptyBoards;