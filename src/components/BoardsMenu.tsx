import './BoardsMenu.css'
import Toggle from "./Toggle";
import { motion, useAnimate, stagger } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import useDialogs  from '../hooks/useDialogs';
import useDatabase from '../hooks/useDatabase';

function BoardsMenu({ darkMode, setDarkMode, showMenu, setShowMenu }
                     : 
                    { darkMode: boolean, setDarkMode: any, showMenu?: boolean, setShowMenu?: any }) {

  const { database }     = useDatabase() 
  const { dialogLaunch, currentBoard, setCurrentBoard } = useDialogs()

  const [boards, setBoards] = useState<string[]>()
  const [boardsCount, setBoardsCount] = useState(0)

  const [scopeMenu, animateMenu] = useAnimate()
  const [scopeNav,  animateNav ] = useAnimate()
 
  const isTablet = useMediaQuery({ query: '( width > 375px )' })

  useEffect(() => {
    setBoards(database.boards.map(board => board.name))
    setBoardsCount(database.boards.length)
  }, [])

  useEffect(() => {
    setBoardsCount(database.boards.length)
  }, [boards])

  useEffect(() => {
    setBoards(database.boards.map(board => board.name))
    setBoardsCount(database.boards.length)
  }, [database.boards])

  useEffect(() => {
    if ( showMenu ) {
      animateMenu([
        [ ".menu-opt", { opacity: 1, scale: 1, filter: "blur(0px)" }, { delay: stagger(0.03, { startDelay: 0.2 }) } ],
      ])
      if (isTablet) {
        animateNav( ".hide-desktop-sidebar", { opacity: 1, scale: 1 }, { delay: 0.1 } )
        animateNav( ".toggle-box", { opacity: 1, scale: 1, filter: "blur(0px)" }, { delay: 0.1 } )
      }
    }
    else {
      animateMenu([
        [ ".menu-opt", { filter: "blur(10px)", scale: 0.5, opacity: 0, }, { delay: stagger(0.02, { from: "last" }) } ],
      ])
      if (isTablet) {
        animateNav( ".hide-desktop-sidebar", { scale: 0.5, opacity: 0, }, { delay: 0.1 } )
        animateNav( ".toggle-box", { filter: "blur(10px)", scale: 0.5, opacity: 0, }, { delay: 0.1 } )
      }
    }
  }, [showMenu])

  useEffect(() => {
    const secuence = [1, 1.5, 1, 1.3, 1]
    const time = 0.5
    animateNav( darkMode ? ".icon-moon" : ".icon-sun", { scale: secuence }, { duration: time } )
  }, [darkMode])

  return (
    <>
      <div className="menu" ref={scopeMenu}>
        {/* Header with Count of Boards */}
        <section className="menu-opt all-boards">{`ALL BOARDS (${boardsCount})`}</section>

        {/* List of Menu Options */}
        <section className="menu-options" >
          { boards && boards.map( (board: string, i: number) => 
              <motion.div className={`menu-opt items ${ i == currentBoard ? "selected" : ""}`} key={i} 
                onClick    = { () => setCurrentBoard(i) }
                whileHover = { i !== currentBoard ? { scale: [1, 1.04, 1, 1.02, 1] } : undefined }
                whileTap   = { i !== currentBoard ? { scale: 0.95 } : undefined }
              >
                <div className="menu-opt-icon"></div>
                <div className="menu-opt-name">{ board }</div>
              </motion.div>
            )
          }
        </section>

        {/* Last Option on List for Creating New Board */}
        <motion.button className="menu-opt create-board" type="button"
          onClick    = { () => dialogLaunch("boardAdd", currentBoard!, 0, 0) }
          whileHover = {{ scale: [1, 1.1, 1, 1.05, 1] }}
          whileTap   = {{ scale: 0.9 }}
        >
          + Create New Board
        </motion.button>
      </div>

      {/* Toggle Switch for switching DarkMode */}
      <section className="nav-menu" ref={scopeNav}>

        <div className="toggle-dark">
          <div className="toggle-box">
            <div className="toggle-items">
              <div className='icon-sun'></div>
              <Toggle isToggled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
              <div className='icon-moon'></div>
            </div>
          </div>
        </div>
        
        { isTablet &&
          <motion.button className="hide-desktop-sidebar" type="button"
            onClick={() => setShowMenu(false)}
            whileHover = { showMenu ? { scale: [1, 1.08, 1, 1.05, 1] } : undefined }
            whileTap   = { showMenu ? { scale: 0.95 } : undefined }
            >
            <div className="icon-hide-sidebar"></div>
            <div className="msg-hide-sidebar">Hide SideBar</div>
          </motion.button>
        }

      </section>
    </>
  );
}
export default BoardsMenu;