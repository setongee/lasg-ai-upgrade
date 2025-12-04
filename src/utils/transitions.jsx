import React from 'react'
import { motion } from 'framer-motion'
import './transitions.scss'

export default function Transitions(props) {

  return (

    <div>

      {/* <motion.div 
        className='slide__transition'
        initial = {{scaleY : 0}}
        animate = {{scaleY : 0}}
        exit={{scaleY : 1}}
        transition={{duration : 3, ease : [0.22, 1, 0.36, 1] }}
      >
      </motion.div>

      <motion.div 
        className='slide__transition__out'
        initial = {{scaleY : 1}}
        animate = {{scaleY : 0}}
        exit={{scaleY : 0}}
        transition={{duration : 3, ease : [0.22, 1, 0.36, 1] }}
      >
      </motion.div> */}

      {props.children}      

    </div>

  )

}

