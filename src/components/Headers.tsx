import logoMobile       from '../assets/logo-mobile.svg'
import logoDesktopDark  from '../assets/logo-dark.svg'
import logoDesktopLight from '../assets/logo-light.svg'
import chevronDown from '../assets/icon-chevron-down.svg'
import plusSign    from '../assets/icon-add-task-mobile.svg'
import ellipsis    from '../assets/icon-vertical-ellipsis.svg'
import './header.css'
import { motion, stagger, useAnimate } from "framer-motion";
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'


function Header({boardName, setShowMenu, showMenu, darkMode} : 
                {boardName: string, setShowMenu: any, showMenu: boolean, darkMode: boolean}) {

  const isTablet = useMediaQuery({ query: '( width > 375px )' })
  
  const [rotate, setRotate] = useState(0)
  const [scopeTitle, animateTitle] = useAnimate()

  const handleMenu = () => {
    setRotate(showMenu ? 0 : 180)
    setShowMenu(!showMenu)
  }

  const logoDesktopVariants = {
    show: {
      width: 261, borderBottom: "1px solid currentColor",
      transition: { ease: "backInOut", duration: 0.5 }
    },
    hide: { 
      width: 201, 
      transition: { ease: "backInOut", duration: 0.5 }
    }
  }

  useEffect(() => {
    animateTitle( ".letter", { scale: [1, 1.3, 1] }, { duration: 0.3, delay: stagger(0.05) } )
  }, [boardName])

  const space = <>&nbsp;</>

  return (
    <header className="header">

      <div className="header-logo">
        { !isTablet ?
          <div className="logo-header-mobile">
            <img src = { logoMobile } alt="logo" />
          </div>
          :
          <motion.div className="logo-header-desktop"
            variants = { logoDesktopVariants }
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
            onClick={handleMenu}>
            <motion.img src={chevronDown} alt="menu"
              animate = {{ rotate }}
            />
          </button>

        </div>

        <nav className="nav">
          <motion.button className="add" type="button"
            whileHover={{ scale: [1, 1.1, 1, 1.05, 1] }}
            whileTap   = {{ scale: 0.9 }}
          >
            <img src={plusSign} alt="plus" />
            <p className="message">+ Add New Task</p>
          </motion.button>
          <motion.button className="ellipsis" type="button"
            whileHover={{ scale: [1, 1.5, 1, 1.3, 1] }}
            whileTap   = {{ scale: 0.9 }}
          >
            <img src={ellipsis} alt='ellipsis' />
          </motion.button>
        </nav>
      </div>

    </header>
  )
}
export default Header

