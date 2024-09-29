import './header.css'
import logoMobile       from '../assets/logo-mobile.svg'
import logoDesktopDark  from '../assets/logo-dark.svg'
import logoDesktopLight from '../assets/logo-light.svg'
import chevronDown from '../assets/icon-chevron-down.svg'
import plusSign    from '../assets/icon-add-task-mobile.svg'
import ellipsis    from '../assets/icon-vertical-ellipsis.svg'
import { AnimatePresence, motion, stagger, useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useClickAway } from 'simple-react-clickaway';
import { Button } from './Button'
import useDatabase from '../hooks/useDatabase'
import useDialogs  from '../hooks/useDialogs'


function Header({boardName, setShowMenu, showMenu, darkMode} : 
                {boardName: string, setShowMenu: any, showMenu: boolean, darkMode: boolean}) {

  const isTablet  = useMediaQuery({ query: '( width > 376px )' })
  const isDesktop = useMediaQuery({ query: '( width > 769px )' })
  
  const [rotate, setRotate] = useState(0)
  const [scopeTitle, animateTitle] = useAnimate()
  const [showMenuEllipsis, setShowMenuEllipsis] = useState(false)
  const { database } = useDatabase()
  const { dialogLaunch, currentBoard } = useDialogs()

  const handleMenu = () => {
    setShowMenu(!showMenu)
  }

  const logoTabletVariants = {
    show: {
      width: 261,
      transition: { ease: "backInOut", duration: 0.5 }
    },
    hide: { 
      width: 201, 
      transition: { ease: "backInOut", duration: 0.5 }
    }
  }

  const logoDesktopVariants = {
    show: {
      width: 300,
      transition: { ease: "backInOut", duration: 0.5 }
    },
    hide: { 
      width: 210, 
      transition: { ease: "backInOut", duration: 0.5 }
    }
  }

  useEffect(() => {
    animateTitle( ".letter", { scale: [1, 1.3, 1] }, { duration: 0.3, delay: stagger(0.05) } )
  }, [boardName])

  useEffect(() => {
    setRotate(showMenu ? 0 : 180)
  }, [showMenu])

  const space = <>&nbsp;</>

  const boards = database.boards.length

  function getFontSize(textLength: number) {
    const baseSize = 9
    if (textLength >= baseSize) {
      textLength = baseSize - 2
    }
    const fontSize = baseSize - textLength
    return `${fontSize}vw`
  }

  return (
    <header className="header">

      <div className="header-logo">
        { !isTablet ?
          <div className="logo-header-mobile">
            <img src = { logoMobile } alt="logo" />
          </div>
          :
          <motion.div className="logo-header-desktop"
            variants = { isDesktop ? logoDesktopVariants : logoTabletVariants }
            initial  = { false }
            animate  = { showMenu ? "show" : "hide" }
          >
            <img src = { darkMode ? logoDesktopDark : logoDesktopLight } alt="logo" />
          </motion.div>
        }
      </div>

      <div className="title-set">
        <div className="board-name" ref={scopeTitle}>

          <motion.h1 className="title">
            {[...boardName].map((letter: string, i: number) => 
              <motion.span key={i} className="letter"
              >
                { letter != ' ' ? letter : space }
              </motion.span>
            )}
          </motion.h1>

          <button className="toggle-menu" type='button'
            onClick={handleMenu}
          >
            <motion.img src={chevronDown} alt="menu"
              animate = {{ rotate }}
            />
          </button>

        </div>

        <nav className="nav">
          <Button className="add button primary large"
            onClick  = { () => dialogLaunch("taskAdd", currentBoard!, 0, 0) }
            disabled = { database.boards.length == 0 || database.boards[currentBoard!].columns.length == 0 }
          >
            <img src={plusSign} alt="plus" />
            <p className="message">+ Add New Task</p>
          </Button>

          <motion.button className="ellipsis" type="button"
            whileHover = {{ scale: boards ? [1, 1.5, 1, 1.3, 1] : 1 }}
            whileTap   = {{ scale: boards ? 0.9 : 1}}
            onClick    = {(e) => {
              e.stopPropagation()
              setShowMenuEllipsis(!showMenuEllipsis)
            }}
            disabled = { !boards }
          >
            <img src={ellipsis} alt='ellipsis' />
          </motion.button>
          <AnimatePresence>
            { showMenuEllipsis && 
              <MenuEllipsis setShowMenuEllipsis={setShowMenuEllipsis} board={currentBoard!}/>
            }
          </AnimatePresence>
        </nav>
      </div>

    </header>
  )
}
export default Header


function MenuEllipsis( { setShowMenuEllipsis, board }: { setShowMenuEllipsis: (show: false) => void, board: number } ) {
  
  const refMenu = useRef(null)
  const { disable, enable } = useClickAway(refMenu, () => setShowMenuEllipsis(false))
  const { dialogLaunch } = useDialogs()
  
  useEffect(() => {
    enable()
    return () => disable() 
  }, [])

  return (
    <>
      <motion.div className="ellipsis-menu" ref={refMenu}
        initial    = {{ scale: 0 }}
        animate    = {{ scale: 1 }}
        exit       = {{ scale: 0 }}
        transition = {{ duration: 0.2 }}
      >
  
        <div className="ellipsis-menu__option edit"
          onClick={(e) => {
            e.stopPropagation()
            setShowMenuEllipsis(false)
            dialogLaunch("boardEdit", board, 0, 0)
          }}
          >Edit Board
        </div>
  
        <div className="ellipsis-menu__option delete"
          onClick={(e) => {
            e.stopPropagation()
            setShowMenuEllipsis(false)
            dialogLaunch("boardDelete", board, 0, 0)
          }}
          >Delete Board
        </div>
  
      </motion.div>
    </>
  )
}

