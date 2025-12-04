import React from 'react'
import './themes.scss'
import Container from '../../../components/container/container'
import legi from '../../../assets/lottie/themes/transport.lottie'

export default function Themes() {
  return (

    <div className="themes__body">

        <Container>

            <div className="themes">
                
                <div className="theme__info">

                    <div className="themes__title">

                        Investing in the people of Lagos through the <span>THEMES+ agenda</span>

                    </div>

                    <div className="themes__subtitle">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa tempora dignissimos dolore quidem nostrum cumque.
                    </div>

                </div>

                <div className="themes__content flex">

                    <div className="agenda">

                        <div className="index">

                            <dotlottie-player 
                                src={legi} 
                                background="transparent" 
                                speed="1" 
                                loop 
                                autoplay>   
                            </dotlottie-player>

                        </div>

                        <p>Transportation and Traffic Management</p>

                        <span>Lorem ipsum dolor sit, amet cons ectetur adipisicing elit.</span>

                    </div>

                    <div className="agenda">

                        <div className="index">

                            <dotlottie-player 
                                src={legi} 
                                background="transparent" 
                                speed="1" 
                                loop 
                                autoplay>   
                            </dotlottie-player>

                        </div>

                        <p>Transportation and Traffic Management</p>

                        <span>Lorem ipsum dolor sit, amet cons ectetur adipisicing elit.</span>

                    </div>

                    <div className="agenda">

                        <div className="index">

                            <dotlottie-player 
                                src={legi} 
                                background="transparent" 
                                speed="1" 
                                loop 
                                autoplay>   
                            </dotlottie-player>

                        </div>

                        <p>Transportation and Traffic Management</p>

                        <span>Lorem ipsum dolor sit, amet cons ectetur adipisicing elit.</span>

                    </div>

                    <div className="agenda">

                        <div className="index">

                            <dotlottie-player 
                                src={legi} 
                                background="transparent" 
                                speed="1" 
                                loop 
                                autoplay>   
                            </dotlottie-player>

                        </div>

                        <p>Transportation and Traffic Management</p>

                        <span>Lorem ipsum dolor sit, amet cons ectetur adipisicing elit.</span>

                    </div>

                    <div className="agenda">

                        <div className="index">

                            <dotlottie-player 
                                src={legi} 
                                background="transparent" 
                                speed="1" 
                                loop 
                                autoplay>   
                            </dotlottie-player>

                        </div>

                        <p>Transportation and Traffic Management</p>

                        <span>Lorem ipsum dolor sit, amet cons ectetur adipisicing elit.</span>

                    </div>

                    <div className="agenda">

                        <div className="index">

                            <dotlottie-player 
                                src={legi} 
                                background="transparent" 
                                speed="1" 
                                loop 
                                autoplay>   
                            </dotlottie-player>

                        </div>

                        <p>Transportation and Traffic Management</p>

                        <span>Lorem ipsum dolor sit, amet cons ectetur adipisicing elit.</span>

                    </div>

                    <div className="agenda">

                        <div className="index">

                            <dotlottie-player 
                                src={legi} 
                                background="transparent" 
                                speed="1" 
                                loop 
                                autoplay>   
                            </dotlottie-player>

                        </div>

                        <p>Transportation and Traffic Management</p>

                        <span>Lorem ipsum dolor sit, amet cons ectetur adipisicing elit.</span>

                    </div>

                </div>

            </div>

        </Container>

    </div>

  )
}
