import BoardsMenu from './BoardsMenu';
import { motion } from "framer-motion";
import { useMediaQuery } from 'react-responsive';
import './Sidebar.css'

const backdropVariants = {
  show: { display: "flex", opacity: 1, delayChildren: 1 },
  hide: { 
    opacity: 0,
    transitionEnd: { display: "none" },
    transition: { delay: 0.1 }
  }
}

const sidebarMobileVariants = {
  show: { y: 0,        transition: { type: "spring", damping: 25, stiffness: 500 } },
  hide: { y: "-100vh", transition: { type: "tween", duration: 0.4 } }
}

const sidebarDesktopVariants = {
  show: {
    width: 261, opacity: 1,
    transition: { ease: "backInOut", duration: 0.5 }
  },
  hide: { 
    width: 0, opacity: 0, 
    transition: { ease: "backInOut", duration: 0.6 }
  }
}

function Sidebar ( { boards, showMenu, setShowMenu, darkMode, setDarkMode, selected, setSelected }
                    : 
                   { boards: any, showMenu: boolean, setShowMenu?:any, darkMode: boolean, setDarkMode: any, selected: number, setSelected: any }
                  ) {
  
  const isTablet = useMediaQuery({ query: '( width > 375px )' })

  return (
    <>
      {/* Sidebar for mobile screens ======================================================== */}
      { !isTablet &&
        <motion.div className="sidebar-mobile-backdrop"
          key        = "sidebar-mobile"
          variants   = { backdropVariants }
          initial    = { false }
          animate    = { showMenu ? "show" : "hide" }
          onClick    = { () => setShowMenu(false) }
        >
          <motion.aside className="sidebar-body"
            key       = "sidebar-mobile-body"
            variants  = { sidebarMobileVariants }
            initial   = { false }
            animate   = { showMenu ? "show" : "hide" }
            onClick   = { (e) => e.stopPropagation() }
          >
            <BoardsMenu 
              boards      = { boards } 
              darkMode    = { darkMode } 
              setDarkMode = { setDarkMode }
              showMenu    = { showMenu }
              selected    = { selected }
              setSelected = { setSelected } 
            />
          </motion.aside>
        </motion.div>
      }
      {/* Sidebar for desktop screens ======================================================= */}
      { isTablet &&
        <motion.aside className = "sidebar-desktop"
          variants = { sidebarDesktopVariants }
          initial  = { false }
          animate  = { showMenu ? "show" : "hide" }
        >
          {/* Show menu contents of boards ==================================================== */}
          <BoardsMenu 
            boards      = { boards } 
            darkMode    = { darkMode } 
            setDarkMode = { setDarkMode }
            showMenu    = { showMenu }
            setShowMenu = { setShowMenu }
            selected    = { selected }
            setSelected = { setSelected }
          />
        </motion.aside>
      }
    </>
  )
}
export default Sidebar