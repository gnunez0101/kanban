import './Button.css'
import { motion } from "framer-motion";

type typeProps = {
  className?: string,
  onClick?:   React.MouseEventHandler<HTMLButtonElement>,
  disabled?: boolean,
  type?:      "button" | "submit" | "reset" | undefined
  children?:  React.ReactNode
}

export function Button ( props : typeProps ) {
  return (
    <motion.button className={`button ${props.className}`}
      onClick    = { props.onClick }
      disabled   = { props.disabled }
      type       = { props.type }
      initial    = { { scale: 1 } }
      whileHover = { { scale: props.disabled ? 1 : [1, 1.03, 1, 1.01, 1] } }
      whileTap   = { { scale: props.disabled ? 1 : 0.98 } }
    >
      { props.children }
    </motion.button>
  )
}