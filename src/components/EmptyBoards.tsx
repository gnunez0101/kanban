import './EmptyDialogs.css'
import { Button } from './Button';
import useDialogs from '../hooks/useDialogs';

function EmptyBoards() {
  const { dialogLaunch } = useDialogs()
  return ( 
    <>
      <div className="empty-container">
        <div className="empty-dialog">
          <p className="empty-text">
            There's no boards. Create a new board to get started.
          </p>
          <div className="button-container">
            <Button 
              onClick={() => dialogLaunch("boardAdd", 0, 0, 0) }
            >
              + Add New Board
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default EmptyBoards;