import React from 'react'
import Container from '../../components/container/Container'
import landingpage from '../../assets/photos/ministry-of-finance-landing-page.jpeg'
import './home.scss'
import { ArrowRight } from 'iconoir-react'
import Newsroom from '../../components/newsroom/newsroom'
import Footer from '../../components/footer/footerArea'

export default function Home() {
  return (
   
        <div className="home">

            <div className="landing">

                <div className="land">
                    <img src={landingpage} alt="" draggable = {false} />
                </div>

                <Container>

                    <div className="landingPage"> 

                        <div className="title__landing">The Ministry of Finance supports Lagos State's democratic goals through financial stability. </div>

                        <p>
                            Empowering Lagos State’s vision with robust financial management for sustainable growth and democratic dividends.
                        </p>

                        <div className="button__read"> Read More <ArrowRight width={18} /> </div>
                    
                    </div>

                </Container>

            </div>

            <div className="stories">

                <Newsroom/>

            </div>

            <Footer/>

        </div>

  )
}
