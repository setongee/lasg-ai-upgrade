import React, { useState } from 'react'
import './subs.scss'
import { ArrowUpRight } from 'iconoir-react'
import pattern from '../../assets/hd/patthern.png'
import Container from '../container/container'
import SubscribeModal from './subscribeModal'

export default function Subscribe() {

  const [ subscription, setSubscription ] = useState(false);

  const handleCloseSubscription = () => {

    setSubscription(false);
    document.body.style.overflowY = 'visible'

  }

  return (

    <div className="subs">

        {
          subscription ? <SubscribeModal closeSubscribe = {handleCloseSubscription} /> : null
        }
        
        <Container>

            <div className="subscribe">

                <div className="subscribe__card">

                    <div className="path"> <img src = {pattern} alt="patternnns" /> </div>


                    <div className="main"> Get notified about the latest news, events, and topics that interest you </div>
                    <div className="main__sub"> Stay informed with updates on topics that matter most to you, and never miss a thing!  </div>
                    <div className="subscribe__action__button" onClick={ () => setSubscription(true) }> Setup your interests <ArrowUpRight width={18} strokeWidth={2} /> </div>

                </div>

            </div>

        </Container>
        
    </div>

  )
}
