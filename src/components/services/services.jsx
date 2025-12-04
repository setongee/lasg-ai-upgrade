import React, {useState, useEffect} from 'react'
import Container from '../container/container'
import './services.scss'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'

import { getAllCategory } from '../../api/read/category.req'
import Loader from '../loader/loader'
import { sortArray } from '../../middleware/middleware'
import { useQuery } from '@tanstack/react-query'


export default function Services({bgColor, location, data_limit}) {

    const [categories, setCategories] = useState([])

    const categoryData = useQuery({

        queryKey: ["category"],
        queryFn: () => getAllCategory()

    })

    useEffect(() => {
        
        sortArray(categoryData?.data?.data, "name").then( sortedArr => setCategories(sortedArr) );
        
    }, [categoryData?.data]);

  return (

    <div className={`services ${location === "services" ? "server" : ''}`} id='services' style={{backgroundColor : bgColor}} >

        <Container>

            {
                location === 'home' ? (

                    <div className="midTopic">

                        <div className="topic thick_700">Browse all Lagos State Services & Topics</div>
                        <div className="subtitle uppercase">Making it easier to have quick access to Lagos State services and information</div>

                    </div>

                ) : null
            }

            {
                !categoryData.isLoading ?
                <div className = { `servicesPlatoon ${location === 'services' ? 'servicePagePlatoon' : '' } ` } >

                {
                    categories?.map( (lasg_service, index) => {
                        
                        return (

                            <motion.div 
                            className="services_card" 
                            onClick={() => window.location.href = `/services/${lasg_service.formattedName}` } key={index}
                            
                            >

                                <div className="icon"> 

                                    <div className="hov hov1">

                                        <img src={lasg_service.icon} alt="" />   

                                    </div>  

                                    <div className="hov hov2">

                                        <img src={lasg_service.icon} alt="" />   

                                    </div>                                      

                                </div>

                                <div className="title thick"> {lasg_service.name} </div>

                                <div className="subtext"> {lasg_service.short} </div>

                            </motion.div>      

                        )

                    })
                }
                

            </div> : <div className="fullPortion"><Loader/></div>
            }

            {/* {
                location === 'home' ? (

                    <motion.div className="view_all thick"
            
                        onClick={ () => {
                            
                            if (limit === 11) {

                                setLimit( LASG_SERVICES.length )

                            } else {
                                setLimit(11);
                                window.location.href = '#services'
                            }

                        } } > 
                        
                        Explore More { limit === 11 ? <ArrowDown strokeWidth={2} width={15} height={15} /> : <ArrowUp strokeWidth={2} width={15} height={15} /> } 
                        
                    </motion.div>

                ) : null
            } */}

        </Container>

    </div>

  )
}
