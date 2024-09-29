import './DialogModal.css'
import useDialogs from '../hooks/useDialogs'
import { motion } from "framer-motion"
import { useEffect } from 'react'

type typeBackdrop = {
  children: React.ReactNode
}

export default function DialogModal ( props: typeBackdrop ) {
  const { dialogLaunch } = useDialogs()

  const dialogVariant = {
    hide: { scale: 0, rotate: "12.5deg" },
    show: { scale: 1, rotate: "0deg", transition: { type: "spring", damping: 22, stiffness: 700 }},
    exit: { scale: 0, rotate: "0deg", transition: { ease: "backOut", duration: 0.3 }},
  }

  useEffect(() => {
    // Listening ESC Key to close dialogs:
    function handleEsc(event: KeyboardEvent) {
      if ( event.key === 'Escape' ) 
        dialogLaunch("close")
    }
    window.addEventListener("keydown", handleEsc)
    return () => { window.removeEventListener('keydown', handleEsc) }
  }, [])

  return (
    <motion.div className="backdrop" id='backdrop'
      initial = {{ opacity: 0 }}
      animate = {{ opacity: 1 }}
      exit    = {{ opacity: 0 }}
      onClick = { () => dialogLaunch("close") }
    >
      <motion.div className="dialog-modal"
        variants = {dialogVariant}
        initial  = "hide"
        animate  = "show"
        exit     = "exit"
        onClick  = {(e) => e.stopPropagation()}
      >  
        <motion.div className="dialog-container" layout>
          { props.children }
        </motion.div> 
      </motion.div>
    </motion.div>
  )
}