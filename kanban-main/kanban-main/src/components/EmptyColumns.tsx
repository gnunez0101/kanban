import './EmptyDialogs.css'
import { motion } from 'framer-motion';

function EmptyColumns() {
  return ( 
    <>
      <div className="empty-container">
        <div className="empty-dialog">
          <p className="empty-text">
            This board is empty. Create a new column to get started.
          </p>
          <div className="button-container">
            <motion.button type="button"
              whileHover = {{ scale: [1, 1.1, 1, 1.05, 1] }}
              whileTap   = {{ scale: 0.9 }}
            >
              + Add New Column
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
export default EmptyColumns;