import './toggle.css'
import { motion } from 'framer-motion'

const Toggle = ( { isToggled, onToggle, isDisabled = false, label } 
                  : 
                 { isToggled: boolean, onToggle: any, isDisabled?: boolean, label?: string } ) => {
    
    const spring = {
      type: "spring",
      stiffness: 700,
      damping: 30
    }

    return (
      <motion.div className='toggle'
        whileHover={{scale: [1,1.1,1,1.05,1]}}
      >
        <div className="switch" data-toggled={isToggled} data-disabled={isDisabled} onClick={onToggle}>
          <motion.div className="handle" layout transition={spring} />
        </div>
        <div className="label-text">{label}</div>
      </motion.div>
    )
}
export default Toggle