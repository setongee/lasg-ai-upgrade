import React,{useEffect, useState} from 'react'
import './news.scss'
import Container from '../../../components/container/container'
import TabTitle from '../../../components/tabHeading/tabTitle'
import { ArrowLeft, ArrowRight, Play, PlaySolid, SoundHigh } from 'iconoir-react'
import { motion } from 'framer-motion'
import { getAllNews } from '../../../api/read/news.req'

export default function News() {

const [news, setNews] = useState(0)
const [muted, setMuted] = useState(false);
const [timemap, setTimeMap] = useState(5);

// const newsData = [

//     {
//         main : "Our agricultural hubs and food security project is not just thriving—it’s revolutionizing how we approach sustenance in Lagos.",
//         sub : "Lorem ipsum dolor sit amet, consectetur elit adfh, Curabitur venenatis velit eget massa volutpat, at rhoncus turpis consequat.",
//         date : "Tues. 06 April, 2024",
//         video : "https://res.cloudinary.com/dydazqid8/video/upload/v1713201328/Our_agricultural_hubs_and_food_security_project_is_not_just_thriving_it_s_revolutionizing_how_we_approach_sustenance_in_Lagos._Each_day_brings_us_closer_to_a_Lagos_where_everyone_has_access_to_affordable_high-quality_food._It_s_a_jou_ffrlgs.mp4",
//         type : "video",
//         photo : ""
        
//     },

//     {
//         main : "Gov. Sanwo-Olu meets London-Lagos solo driver, Ms. Pelumi Nubi, at the Lagos house, marina, on Monday, 8th April 2024.",
//         sub : "Lorem ipsum dolor sit amet, consectetur elit adfh, Curabitur venenatis velit eget massa volutpat, at rhoncus turpis consequat.",
//         date : "Tues. 06 April, 2024",
//         photo : "https://pbs.twimg.com/media/GKpzMPhWsAAP1zB?format=jpg",
//     },

//     {
//         main : "I met with the National Emergency Management Agency (NEMA) team led by the Director-General, Mrs. Zubaida Umar.",
//         sub : "Lorem ipsum dolor sit amet, consectetur elit adfh, Curabitur venenatis velit eget massa volutpat, at rhoncus turpis consequat.",
//         date : "Tues. 06 April, 2024",
//         photo : "https://pbs.twimg.com/media/GK-gJQ_XUAEDeia?format=jpg&name=large",
//     }

// ]

const [newsData, setNewsData] = useState([])

const nextShow = () => {

    if ( news !== (newsData.length - 1) ) {

        setNews( news + 1 );
        document.querySelector('.lineCheck').classList.remove('running');
        setMuted(false);
        
        setTimeout(() => {

            //const pl = document.querySelector('.lineCheck')
            document.querySelector('.lineCheck').classList.add('running');
            
        }, 100);


    } else{
        resetSlider();
        document.querySelector('.lineCheck').classList.remove('running');
        setMuted(false);
        
        setTimeout(() => {

            document.querySelector('.lineCheck').classList.add('running');
            
        }, 100);
    }

}

const prevShow = () => {

    if ( news !== 0 ) {

        setNews(news-1);
        document.querySelector('.lineCheck').classList.remove('running');
        setMuted(false);
        
        setTimeout(() => {

            document.querySelector('.lineCheck').classList.add('running');
            
        }, 100);

    } else {
        setNews(newsData.length - 1)
        document.querySelector('.lineCheck').classList.remove('running');
        setMuted(false);
        
        setTimeout(() => {

            document.querySelector('.lineCheck').classList.add('running');
            
        }, 100);
    }

}

const resetSlider = () => {

    setNews(0);

}

const soundControl = e => {

    setMuted(!muted)

    const videoPlaying = document.getElementById('videoControl');
    videoPlaying.muted = muted;

}


useEffect(() => {

    setTimeMap(5);

    // // const interval = setInterval(() => {

    // //     // nextShow();
        
    // // }, 5000);
    
    // return () => clearInterval(interval);
   
}, [news]);

useEffect(() => {
        
    getAllNews(0, 'all').then( (res) => {

        const filteredIndex = res.data.filter( (e, index) => index < 5 )
        setNewsData(filteredIndex);

    } )
    
}, []);

console.log(newsData)


  return (

   <div className="recent_news" id = 'news' >

       <Container>

            <TabTitle title = 'Latest News & Updates' url = '#' />
            
            <div className="newsAreaHome">

                <motion.div className="content">

                    <div className="tag uppercase">Govornor's Address</div>
                    
                    <div className="main thick"> { newsData[news]?.title } </div>

                    <div className="sub"> { newsData[news]?.sub } </div>

                    <div className="date_control">

                        <div className="lineCheck" style={{animationDuration :`${timemap}s`}} ></div>

                        <div className="date thick"> { newsData[news]?.date } </div>

                        <div className="arrowOpp">

                            <motion.div className="arrowChange" 
                            
                            onClick={()=> prevShow()}
                            
                            whileHover={{
                                scale: 1.1,
                                transition: { duration: .2 },
                            }}
                            whileTap={{ scale: .95 }} > 
                                  
                                  <ArrowLeft strokeWidth={1.5} /> 
                            
                            </motion.div>

                            <motion.div className="arrowChange" 
                            
                            onClick={()=> nextShow()}
                            
                            whileHover={{
                                scale: 1.1,
                                transition: { duration: .2 },
                            }}
                            whileTap={{ scale: .95 }} > 
                                  
                                  <ArrowRight strokeWidth={1.5} /> 
                            
                            </motion.div>

                        </div>

                    </div>

                </motion.div>

                <div className="media">

                    {
                        newsData[news]?.type !== "video" ? <img src={ newsData[news]?.photo } alt="" /> : <div className="mintVideo">

                            <video autoPlay muted src={newsData[news]?.video} id='videoControl' onEnded = { () => nextShow() } playsInline > </video>

                            <div className="console">

                                <motion.div 

                                whileHover={{
                                    scale: 1.1,
                                    transition: { duration: .2 },
                                  }}
                                  whileTap={{ scale: .95 }}

                                className="control sound"
                                > 

                                    <SoundHigh strokeWidth={1.5} onClick={ e => soundControl(e) }/> 
                                
                                </motion.div>

                            </div>

                        </div>
                    }

                </div>

            </div>

       </Container>

   </div>

  )

}
