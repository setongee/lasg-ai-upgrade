import React, {useEffect, useState} from 'react'
import './news__carrier.scss'
import Container from '../../../components/container/container'
import { Timer } from 'iconoir-react'
import { getAllNews } from '../../../api/read/news.req'
import { convertToTitleCase, formatDate, readingTime, truncateText } from '../../../middleware/middleware'


export default function NewsCarrier() {

const [news, setNews] = useState([]);

useEffect(() => {
    
    getAllNews(0, 'all').then( (res) => {

        const filteredIndex = res.data.filter( (e, index) => index < 5 )
        setNews(filteredIndex);

    } )

}, []);

  
return (

   <div className="rent">

    <Container>

        <div className="news_card_body renty">

            <div className="notion"> Stay Informed with the latest news </div>
            <p> Read latest news and events in Lagos state </p>

            <div className="news_results_section">

                {
                    news.map( (res) => (

                        <a className="news_card" key = {res._id} href={`/news/${res.categories[0]}/view/${res._id}`}  >

                            <div className="news_image">
                                <img src={res.photo} />
                            </div>

                            <div className="news_body_content">

                                <div className="date"> {formatDate(res.date)} </div>

                                <div className="news_topic"> { truncateText(convertToTitleCase(res.title), 75) } </div>

                                <div className="news_details">

                                    <div className="details_themes"> {res.categories[0]} </div>
                                    <div className="details_readTime"> <Timer/> { readingTime(res.content) } Mins Read - </div>

                                </div>

                            </div>

                        </a>

                    ))
                }

            </div>

        </div>

    </Container>

   </div>

  )

}
