import React from 'react'
import { motion } from 'framer-motion'

export function SplitText({ children, major, ...rest }) {
  let words = children.split(' ')
  return words.map((word, i) => {
    return (
      <div
        key={children + i}
        style={{ display: 'inline-block', overflow: 'hidden'}}
        className={`lime ${major === "yep" ? 'isHome' : "many"}`}
      >
        <motion.div

          {...rest}
          style={{ display: 'inline-block', willChange: 'transform' }}
          custom={i}

        >

          {word + (i !== words.length - 1 ? '\u00A0' : '')}

        </motion.div>

      </div>
    )
  })
}