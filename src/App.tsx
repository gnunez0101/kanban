import './App.css'
import Sidebar     from './components/Sidebar'
import Header      from './components/Headers'
import EmptyBoards from './components/EmptyBoards'
import Board       from './components/Board'
import showSideBar from './assets/icon-show-sidebar.svg'
import { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { useMediaQuery } from 'react-responsive'
import data from './assets/data.json'
// const data = { "boards" : [] }

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(0)

  const isTablet = useMediaQuery({ query: '( width > 375px )' })


  const buttonVariants = {
    hidden: { 
      x: -200, opacity: 0,
      transition: {
        type: "tween", duration: 0.5
      }
    },
    show: {
        x: 0, opacity: 1,
        transition: { 
          type: "spring", damping: 25, stiffness: 300, delay: 0.4
        }
    },
  }

  let theme = darkMode ? "dark-mode" : "light-mode";

  let boardTitle = "No Boards!"
  if (data.boards.length > 0) boardTitle = data.boards[selectedBoard].name

  return (
    <main className={`main ${theme}`}>

      <Header 
        boardName   = {boardTitle}
        setShowMenu = {setShowMenu}
        showMenu    = {showMenu}
        darkMode    = {darkMode}
      />

      <div className="app-container">
          <Sidebar 
            boards      = {data}            
            showMenu    = {showMenu}
            setShowMenu = {setShowMenu}
            darkMode    = {darkMode}
            setDarkMode = {setDarkMode}
            selected    = {selectedBoard}
            setSelected = {setSelectedBoard}
          />

          <div className="board-container">
            <div className="board-body">
              { data.boards.length == 0 ?
                <EmptyBoards />
                :
                <Board board = { data.boards[selectedBoard] } />
              }
            </div>
            <Attribution />
          </div>
      </div>

      { isTablet &&
        <AnimatePresence mode='wait'>
          { !showMenu &&
            <motion.button className="show-sidebar"
              type='button' key="show-sidebar"
              variants   = {buttonVariants}
              initial    = "hidden"
              animate    = "show"
              exit       = "hidden"
              whileHover = {{ scale: [1, 1.2, 1, 1.1, 1] }}
              whileTap   = {{ scale: 0.9 }}
              onClick    = {() => setShowMenu(true)}>
              <img src={showSideBar} alt="show" />
            </motion.button>
          }
        </AnimatePresence>
      }
      <div className="dialogs"></div>
    </main>
  )
}
export default App

function Attribution() {
  return (
    <div className="attribution">
    Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
    Coded by <a href="https://linkedin.com/in/gnunez0101"> Gonzalo M. Núñez</a>.
  </div>
  )
}
