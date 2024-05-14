import { motion } from "framer-motion"
import './DialogModal.css'

type typeBackdrop = {
  children: React.ReactNode,
  onClick:  React.MouseEventHandler<HTMLDivElement> | undefined
}

export default function DialogModal ( props: typeBackdrop ) {

  const dialogVariant = {
    hide: { scale: 0, rotate: "12.5deg" },
    show: { scale: 1, rotate: "0deg", transition: { type: "spring", damping: 22, stiffness: 700 }  },
    exit: { scale: 0, rotate: "0deg", transition: { ease: "backOut", duration: 0.7 } },
  }

  return (
    <motion.div className="backdrop"
      onClick = { props.onClick }
      initial = {{ opacity: 0 }}
      animate = {{ opacity: 1 }}
      exit    = {{ opacity: 0 }}
    >
      <motion.div className="dialog-modal"
        onClick  = {(e) => e.stopPropagation()}
        variants = {dialogVariant}
        initial  = "hide"
        animate  = "show"
        exit     = "exit"
      >

        { props.children }
        
      </motion.div>
    </motion.div>
  )
}