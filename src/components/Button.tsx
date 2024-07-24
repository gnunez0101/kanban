import './Button.css'
import { motion } from "framer-motion";

type typeProps = {
  className?: string,
  onClick?:   React.MouseEventHandler<HTMLButtonElement>,
  type?:      "button" | "submit" | "reset" | undefined
  children?:  React.ReactNode
}

export function Button ( props : typeProps ) {
  return (
    <motion.button className={`button ${props.className}`}
      onClick    = { props.onClick }
      type       = { props.type }
      initial    = { { scale: 1 } }
      whileHover = { { scale: [1, 1.03, 1, 1.01, 1] } }
      whileTap   = { { scale: 0.98 } }
    >
      { props.children }
    </motion.button>
  )
}