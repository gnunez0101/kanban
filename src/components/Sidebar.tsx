import BoardsMenu from './BoardsMenu';
import { AnimatePresence, motion } from "framer-motion";
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
  showTablet: {
    width: 261, 
    opacity: 1,
    transition: { ease: "backInOut", duration: 0.5 }
  },
  showDesktop: {
    width: 300, 
    opacity: 1,
    transition: { ease: "backInOut", duration: 0.5 }
  },
  hide: { 
    width: 0, opacity: 0, 
    transition: { ease: "backInOut", duration: 0.6 }
  }
}

function Sidebar ( { showMenu, setShowMenu, darkMode, setDarkMode }
                    : 
                   { showMenu: boolean, setShowMenu?:any, darkMode: boolean, setDarkMode: any }
                  ) {
  
  const isTablet  = useMediaQuery({ query: '( width > 376px )' })
  const isDesktop = useMediaQuery({ query: '( width > 769px )' })

  return (
    <>
      {/* Sidebar for mobile screens ======================================================== */}
      <AnimatePresence mode='wait'>
      { !isTablet && showMenu &&
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
            initial   = "hide"
            animate   = "show"
            exit      = "hide"
            onClick   = { (e) => e.stopPropagation() }
          >
            <BoardsMenu 
              darkMode    = { darkMode }
              setDarkMode = { setDarkMode }
              showMenu    = { showMenu }
              setShowMenu = { setShowMenu }
            />
          </motion.aside>
        </motion.div>
      }
      </AnimatePresence>
      {/* Sidebar for desktop screens ======================================================= */}
      { isTablet &&
        <motion.aside className = "sidebar-desktop"
          variants = { sidebarDesktopVariants }
          initial  = { false }
          animate  = { showMenu ? (isDesktop ? "showDesktop" : "showTablet") : "hide" }
        >
          {/* Show menu contents of boards ==================================================== */}
          <BoardsMenu 
            darkMode    = { darkMode } 
            setDarkMode = { setDarkMode }
            showMenu    = { showMenu }
            setShowMenu = { setShowMenu }
          />
        </motion.aside>
      }
    </>
  )
}
export default Sidebar