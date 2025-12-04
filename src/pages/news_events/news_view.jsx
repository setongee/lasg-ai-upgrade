import React, { useState , useEffect} from 'react'
import './view_news.scss'
import Container from '../../components/container/container'
import { ArrowArchery, ArrowDownLeftCircle, ArrowLeft, ArrowLeftCircle } from 'iconoir-react'
import { news } from '../../api/data/news'
import { useNavigate, useParams } from 'react-router'
import {motion} from 'framer-motion'
import { getAllNews, getSingleNews } from '../../api/read/news.req'
import { useQuery } from '@tanstack/react-query'
import { convertToTitleCase, formatDate, formatDate3, readingTime, sortArray, truncateText } from '../../middleware/middleware'
import Loader from '../../components/loader/loader'

export default function News_view() {

    const {id, topic} = useParams();
    const navigate = useNavigate();

    const [sub_data, setSub_data] = useState([])
    

    const { isLoading, error, data } = useQuery({

        queryKey: ["view_news", {id}],
        queryFn: () => getSingleNews(id)

    })

    const newsData = useQuery({

        queryKey: ["view-news", topic, id],
        queryFn: () => getAllNews(0, topic)

    })

    useEffect(() => {
        
        sortArray(newsData?.data?.data, "date").then( sortedArr => setSub_data(sortedArr) );
        
    }, [newsData?.data]);

    useEffect(() => {
        
        if(data) {
            
            const tc = document.getElementById("text");
            tc.innerHTML = data?.data.content
        }
        
    }, [data]);

    
    const navigateBack = () => {

        navigate(-1);
        navigate(-1);

    }
    

    if (isLoading) return <div className="loaderPage"><Loader/></div>

    if (error) return 'An error has occurred: ' + error.message


  return (
    
    <div className="view_news">

        <Container>

            <div className="overhold flex">

                <div className="news_container">

                    <div className="back_to_news" onClick = { () => navigateBack() } > <ArrowLeft/> </div>

                    <div className="current_news">

                        <div className="dateNow"> 
                            
                            <div className="firstPart flex">

                                { formatDate3(data?.data.date) }

                                <p>-</p>

                                <div className="readtime"> {readingTime(data?.data.content) } Mins Read  </div>

                            </div>
                        
                            <div className="tagsArea"> { data?.data.categories.map( (e, index) => <div className="categoryTag" key={index}> {e} </div> ) } </div>
                        
                        </div>

                        <div className="current_news_title">
                            { convertToTitleCase(data?.data.title) }
                        </div>    

                        <div className="current_news_image">
                            <img src={data?.data.photo} alt="" />
                        </div>                

                        <div className="current_news_body" id='text'>
                            
                        </div>

                    </div>

                </div>

                <div className="sub_news_container">

                    <div className="title__sub__news">
                        <p>Other Related News </p>
                    </div>

                    <div className="sub__news__data">

                        {
                            sub_data?.length ? sub_data.map( (res, index) => {

                                if (index < 8) {

                                    return (
                                        <a className="subs_news" href={`/news/${topic}/view/${res._id}`}>

                                            <div className="sub__image"><img src = {res.photo} alt="" /></div>
                                            <div className="sub__title flex"> 
                                                { truncateText(convertToTitleCase(res.title), 60) } 
                                                <div className="date">{ formatDate3(res.date) }</div>
                                            </div>

                                        </a>
                                    )

                                }

                            } ) : null
                        }

                    </div>

                </div>

            </div>

        </Container>

    </div>

  )
}
