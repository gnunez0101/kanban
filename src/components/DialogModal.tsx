import './DialogModal.css'
import useDialogs from '../hooks/useDialogs'
import { motion } from "framer-motion"

type typeBackdrop = {
  children: React.ReactNode
}

export default function DialogModal ( props: typeBackdrop ) {
  const { dialogLaunch } = useDialogs()

  const dialogVariant = {
    hide: { scale: 0, rotate: "12.5deg" },
    show: { scale: 1, rotate: "0deg", transition: { type: "spring", damping: 22, stiffness: 700 }},
    exit: { scale: 0, rotate: "0deg", transition: { ease: "backOut", duration: 0.7 }},
  }

  return (
    <motion.div className="backdrop"
      onClick = { () => dialogLaunch("close", 0, 0, 0) }
      initial = {{ opacity: 0 }}
      animate = {{ opacity: 1 }}
      exit    = {{ opacity: 0 }}
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