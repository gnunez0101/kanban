import { motion } from "framer-motion"
import './Backdrop.css'

type typeBackdrop = {
  children: React.ReactNode,
  onClick:  React.MouseEventHandler<HTMLDivElement> | undefined
}

export default function Backdrop ( props: typeBackdrop ) {
  return (
    <motion.div className="backdrop"
      onClick = { props.onClick }
      initial = {{ opacity: 0 }}
      animate = {{ opacity: 1 }}
      exit    = {{ opacity: 0 }}
    >
      { props.children }
    </motion.div>
  )
}