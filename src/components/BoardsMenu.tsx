import './BoardsMenu.css'
import Toggle from "./Toggle";
import { motion, useAnimate, stagger } from "framer-motion";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import DialogLaunch from './DialogLaunch';
import useDialogs from '../hooks/useDialogs';

function BoardsMenu({ boards, darkMode, setDarkMode, showMenu, setShowMenu, selected, setSelected }
                     : 
                    { boards: any, darkMode: boolean, setDarkMode: any, showMenu?: boolean, setShowMenu?: any, selected: number, setSelected: any }) {

  const boardsCount = boards.boards.length
  const { dialogLaunch } = useDialogs()

  const [scopeMenu, animateMenu] = useAnimate()
  const [scopeNav,  animateNav ] = useAnimate()
 
  const isTablet = useMediaQuery({ query: '( width > 375px )' })

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

  const secuence = [1, 1.5, 1, 1.3, 1]
  const time = 0.5

  useEffect(() => {
    if(darkMode)
      animateNav( ".icon-moon", { scale: secuence }, { duration: time } )
    else 
      animateNav( ".icon-sun",   { scale: secuence }, { duration: time } )
  }, [darkMode])

  return (
    <>
      <div className="menu" ref={scopeMenu}>
        <section className="menu-opt all-boards">{`ALL BOARDS (${boardsCount})`}</section>

        <section className="menu-options" >

          { boards.boards &&
            boards.boards.map( (board: any, i: number) => 
              <motion.div className={`menu-opt items ${ i == selected ? "selected" : ""}`} 
                key={i} onClick={() => setSelected(i)}
                whileHover = { i !== selected ? { scale: [1, 1.04, 1, 1.02, 1] } : undefined }
                whileTap   = { i !== selected ? { scale: 0.95 } : undefined }
              >
                <div className="menu-opt-icon"></div>
                <div className="menu-opt-name">{ board.name }</div>
              </motion.div>
          )}

        </section>
        <motion.button className="menu-opt create-board" type="button"
          onClick    = { () => dialogLaunch("boardAdd") }
          whileHover = {{ scale: [1, 1.1, 1, 1.05, 1] }}
          whileTap   = {{ scale: 0.9 }}
        >
          + Create New Board
        </motion.button>
      </div>
      
      <section className="nav-menu" ref={scopeNav}>

        <div className="toggle-dark">
          <div className="toggle-box">
            <div className="toggle-items">
              <div className='icon-sun'></div>
              <Toggle isToggled={darkMode} onToggle={()=>setDarkMode(!darkMode)} />
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