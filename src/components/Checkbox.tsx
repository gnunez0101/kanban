import './Checkbox.css'
import { useState } from "react"
import { motion } from 'framer-motion'

interface typeCheckbox {
  className?:   string,
  isChecked:    boolean,
  label?:       string,
  handleChange: any
}

export function Checkbox({ className, isChecked, label, handleChange, ...props}: typeCheckbox ) {
  const [checked, _] = useState(isChecked)

  return (
    <label className='custom-checkbox'>
      <input type = "checkbox"
        className = { className }
        checked   = { checked }
        onChange  = { handleChange }
        {...props}
      />
      <svg className = { `checkbox ${isChecked ? "checked" : ""}` } 
        aria-hidden = "true"
        viewBox="0 0 16 16" fill="none"
      >
        <motion.path
          d = "M4 8 L7 10.6 L12 5"
          strokeWidth = "2"
          stroke = "#fff"
          animate = {{ pathLength: isChecked ? 1 : 0 }}
        />
      </svg>
      <span>{ label }</span>
    </label>
  )
}
