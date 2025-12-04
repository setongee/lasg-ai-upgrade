import React from 'react'
import {motion} from 'framer-motion'
import { truncateText } from '../../middleware/middleware'

export default function SearchResultsQuery({data, i, search}) {

  return (

    <motion.div className="result__card" initial = {{y : 100, opacity : 0}} animate = { { y : 0, opacity : 1 } } transition = { { duration : 1, delay : i * 0.1, type : 'spring' } } onClick = { () => search(data) }  >

        <div className="title">{data.name}</div>
        <div className="subtitle">{data.short}</div>
        <div className="themeArea uppercase"> From {truncateText(data.categories[0], 17)} </div>
    
    </motion.div>

  )
  
}
