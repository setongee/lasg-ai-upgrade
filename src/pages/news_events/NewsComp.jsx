import React, { useState, useEffect } from 'react'
import { Timer } from 'iconoir-react'
import { news } from '../../api/data/news'
import { useParams } from 'react-router';
import none from '../../assets/icons/random/no-file.png'
import { formatDate } from 'date-fns';
import Container from '../../components/container/container';
import { convertToTitleCase, formatDate2, readingTime, truncateText } from '../../middleware/middleware';

export default function NewsComp({ data, topic }) {

    const [news, setNews] = useState(data);
    const [filteredResults, setFilteredResults] = useState([]);


useEffect(() => {
    
    const exportedData = data?.filter((item, idx) => idx > 0 );
    setFilteredResults(exportedData);

}, [data]);

const convertNew = (content) => {

    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.innerText

    const truncate = truncateText(text, 100)

    return truncate;

}

const convertCardTitle = (str) => {

    const text = convertToTitleCase(str)
    const truncate = truncateText(text, 60)
    return truncate;

}

const shreadTag = (str) => {

    const newStr = str.split(' ')[0]
    const returnStr = newStr.replace(',' , '')
    return returnStr;

}

    
  return (

    <div className="fetchedNews">
        {
            data?.length ? (

                <div>

                    <a className="landingNews" href={`/news/${topic}/view/${data[0]._id}`} >

                        <div className="mainHighlight">

                            <div className="overlay"></div>

                            <div className="highlight_image">

                                <img src= {data[0].photo} alt="" />

                            </div>

                            <Container>

                                <div className="contentArea__news">

                                    <div className="highlight_content">

                                        <div className="date"> { formatDate2( data[0]?.date ) } </div>

                                        <div className="highlight_title">
                                            
                                            { convertToTitleCase(data[0].title) }

                                        </div>

                                        <div className="highlight__short" >{ convertNew(data[0].content) }</div>

                                        <div className="info">
                                            <div className="highlight_theme">{ data[0].categories[0] }</div>
                                            <div className="timeToRead"> <Timer/> { readingTime(data[0].content) } Mins Read - </div>
                                        </div>

                                    </div>

                                </div>

                            </Container>

                        </div> 

                    </a>

                    <div className="holderNewsBar">

                        <Container>

                            <div className="news_card_body main">

                                <div className="news_results_section">

                                    {
                                        filteredResults?.length ? (

                                            filteredResults.map( (res, index) => (

                                                <a className="news_card" key = {index} href={`/news/${topic}/view/${res._id}`} >

                                                    <div className="news_image">
                                                        <img src={res.photo} />
                                                    </div>

                                                    <div className="news_body_content">

                                                        <div className="date"> { formatDate2( res.date ) } </div>

                                                        <div className="news_topic"> { convertCardTitle(res.title) } </div>

                                                        <div className="news_details">

                                                            <div className="details_themes"> {shreadTag(res.categories[0])} </div>
                                                            <div className="details_readTime"> <Timer/> { readingTime(data[0].content) } Mins Read - </div>

                                                        </div>

                                                    </div>

                                                </a>

                                            ))

                                        ) : <div className='uppercase' style={{letterSpacing : "2px", fontSize : "11px"}}> No other additional news found! </div>
                                    }

                                </div>

                            </div>

                        </Container>

                    </div>

                </div>

            ) : <div className="loaderPage uppercase-t"> Oops! No news found! </div>
        }
    </div>

  )

}
