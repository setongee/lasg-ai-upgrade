import React from 'react'
import './resources.scss';
import Container from '../../../components/container/container';
import TabTitle from '../../../components/tabHeading/tabTitle';

//Photos
import citizen from '../../../assets/photoAssets/resourse.svg';
import lagride from '../../../assets/photoAssets/car.svg';
import laws from '../../../assets/photoAssets/laws.svg';
import luc from '../../../assets/photoAssets/luc.svg';
import lasbca from '../../../assets/photoAssets/LABSCA.svg';
import lasaa from '../../../assets/photoAssets/LASAA.svg';
import lastma from '../../../assets/photoAssets/LASTMA.svg';

//icons
import { NavArrowLeft, NavArrowRight } from 'iconoir-react';
import { motion } from 'framer-motion';



export default function Resources() {

    const resources = {

        citizen : {

            photo : citizen,
            cta : 'Get Started',
            url : 'https://citizensgate.lagosstate.gov.ng'

        },

        lagride : {

            photo : lagride,
            cta : 'Download App',
            url : 'https://lagosride.com'

        },

        laws : {

            photo : laws,
            cta : 'Download Legal Handbook',
            url : 'https://store.lawpavilion.com'

        },

        luc : {

            photo : luc,
            cta : 'Visit and Read',
            url : 'https://finance.lagosstate.gov.ng/wp-content/uploads/sites/102/2017/02/Pro-Land-use-charge-A4.pdf'

        },

        lasbca : {

            photo : lasbca,
            cta : 'Read / Download Guide',
            url : 'https://lasbca.lagosstate.gov.ng/wp-content/uploads/2023/11/LASBCA-GUIDE.pdf'

        },

        lasaa : {

            photo : lasaa,
            cta : 'See Current rates',
            url : 'http://www.lasaa.com/wp-content/uploads/2012/06/LASAA-RATE-REVIEW-2022-UPDATE.pdf'

        },

        lastma : {

            photo : lastma,
            cta : 'View Fines & Penalties',
            url : 'https://trafficonplus.files.wordpress.com/2018/07/lastma-fines-and-penalties.pdf'

        },

    }


    const shiftRight = () => {

        document.querySelector('.resource_container').scrollLeft += 500

    }

    const shiftLeft = () => {

        document.querySelector('.resource_container').scrollLeft -= 500

    }

  return (

    <div className="resources">

        <Container>

            <TabTitle title = 'Resources' url = '/services/resources' />

            <div className="resource_container">

                {
                    Object.entries(resources).map( (resource, index) => (

                        <div className="resource" key={index}>

                            <div className="image">
                                <img src={ resource[1].photo } alt="citezen" />
                            </div>

                            <div className="cta uppercase thick" 
                            onClick={

                                () => window.open(resource[1].url, '_blank')

                            } > {resource[1].cta} </div>

                        </div>

                    ) )
                }
                
            </div>

        </Container>

        <div className="slideShift">

            <motion.div 

                whileHover={

                    {
                        x: -3,
                        transition: { duration: .2 }
                    }

                }

                onClick={ () => shiftLeft() }

                className="navArrow leftSide" >
                
                <NavArrowLeft strokeWidth={1} color='#000' width={100} height={100}/>
            
            </motion.div>


            <motion.div 

                whileHover={

                    {
                        x: 3,
                        transition: { duration: .2 }
                    }

                }

                onClick={ () => shiftRight() }

                className="navArrow rightSide" >
                
                <NavArrowRight strokeWidth={1} color='#000' width={100} height={100}/>
            
            </motion.div>

            

        </div>

    </div>

  )
}
