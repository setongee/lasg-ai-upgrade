import { ArrowRight, ShareIos } from 'iconoir-react'
import React from 'react'

export default function NewsCard() {
  return (
    
    <div className="newsCard">

        <div className="imageSide">  <img src="https://www.thecable.ng/wp-content/uploads/2024/01/GDcAEGJWEAEIYKu.jpeg" alt="" /> </div>

        <div className="content">

            <div className="date">30 APRIL, 2024</div>

            <div className="news_head"> Sanwo-Olu hosts Super Eagles for AFCON send-forth dinner. </div>

            <div className="actions">
                
                <div className="read">Read News</div>
                <ArrowRight width={18} height={18} color='#fff'/>
                
            </div>

        </div>

    </div>

  )
}
