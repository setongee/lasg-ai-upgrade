import React from 'react'
import './notFound.scss'
import Container from '../../components/container/container'
import tax from '../../assets/icons/service/tax.svg'
import health from '../../assets/icons/service/health.svg'
import gov from '../../assets/icons/service/government.svg'
import house from '../../assets/icons/service/housing.svg'
import { ArrowRight } from 'iconoir-react'
import taxes from '../../assets/404/tax_payments_lagosstate.jpg'
import healthHD from '../../assets/404/lasg_404_health_service.png'
import govHD from '../../assets/404/House-Pics.jpeg'
import housingLa from '../../assets/404/housing lagos.jpg'

const NotFound = () => {
  return (
    <div className="notFound">

        <Container>

            <div className="emptySide">
                
                <div className="textSide">
                    <h1>Sorry, we couldn't find that page.</h1>
                    <span>Head over to the <a href="/">Lagos State Official Homepage</a>, or explore some of our services below.</span>
                </div>

                <div className="servicesSide flex">

                    <div className="serviceSideItem">

                        <div className="photoYarn"> <img src={taxes} alt="" /> </div>

                        <div className="contentSide">

                            <div className="iconSide">
                                <div className="photoy"><img src={tax} alt="" /></div>
                                <p> Tax Payments in Lagos </p>
                            </div>

                            <div className="subServices"> Everything about tax payment in Lagos state, how to pay, where to pay, types of taxes and more. </div>

                            <a href='/services/tax' className="learnmore flex">
                                <p>Explore Tax Services</p>
                                <span> <ArrowRight/> </span>
                            </a>

                        </div>

                    </div>

                    <div className="serviceSideItem">

                        <div className="photoYarn"> <img src={healthHD} alt="" /> </div>

                        <div className="contentSide">

                            <div className="iconSide">
                                <div className="photoy"><img src={health} alt="" /></div>
                                <p> Health Services </p>
                            </div>

                            <div className="subServices">
                                Know more about Lagos State Health Insurance, Request an ambulance, find the nearest hospital.
                            </div>

                            <a href='/services/healthservices' className="learnmore flex">
                                <p>Explore Health Services</p>
                                <span> <ArrowRight/> </span>
                            </a>

                        </div>

                    </div>

                    <div className="serviceSideItem">

                        <div className="photoYarn"> <img src={housingLa} alt="" /> </div>

                        <div className="contentSide">

                            <div className="iconSide">
                                <div className="photoy"><img src={house} alt="" /></div>
                                <p> Housing and Lands in Lagos </p>
                            </div>

                            <div className="subServices"> LASBCA Certificate verification, Property listing, LBIC application form, Opal Membership. </div>

                            <a href='/services/housingandlands' className="learnmore flex">
                                <p>Explore Housing Services</p>
                                <span> <ArrowRight/> </span>
                            </a>

                        </div>

                    </div>

                    <div className="serviceSideItem">

                        <div className="photoYarn"> <img src={govHD} alt="" /> </div>

                        <div className="contentSide">

                            <div className="iconSide">
                                <div className="photoy"><img src={gov} alt="" /></div>
                                <p> Lagos Government Benefits </p>
                            </div>

                            <div className="subServices"> Find out more about benefits rendered to citizens by Lagos State Government. </div>

                            <a href='/services/governmentbenefits' className="learnmore flex">
                                <p> Explore Government Benefits </p>
                                <span> <ArrowRight/> </span>
                            </a>

                        </div>

                    </div>

                </div>

            </div>
            
        </Container>

    </div>
  )
}

export default NotFound
