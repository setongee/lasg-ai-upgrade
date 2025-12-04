import React, {useState, useEffect} from 'react'
import Container from '../../components/container/container'
import './news.scss'
import NewsCard from './newsCard'
import { useNavigate, useParams } from 'react-router'
import NewsComp from './NewsComp'
import { getAllNews } from '../../api/read/news.req'
import { useQuery } from '@tanstack/react-query'
import { getAllCategory } from '../../api/read/category.req'
import { NavArrowLeft, NavArrowRight } from 'iconoir-react'
import Loader from '../../components/loader/loader'
import { sortArray } from '../../middleware/middleware'
import Pagination from '../../components/pagination/pagination'

export default function News_Events() {

    let navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const {page, topic} = useParams();
    const [size, setSize] = useState( { length : 0, pageCount : 0 } );
    const [newsCounter, setNewsCounter] = useState(0);

    
    const newsData = useQuery({

        queryKey: ["news", page, topic],
        queryFn: () => getAllNews((Number(page - 1)), topic)

    })

    const categoryData = useQuery({

        queryKey: ["category"],
        queryFn: () => getAllCategory()

    })

    useEffect(() => {
        
        sortArray(categoryData?.data?.data, "name").then( sortedArr => setCategories(sortedArr) );
        
    }, [categoryData?.data]);

    useEffect(() => {
        
       window.scroll(0,0);

       setSize({
        
        length : newsCounter,
        pageCount : parseInt(newsCounter / 20) + 1

      });

    }, [page, topic, newsCounter]);

    useEffect(() => {
        
        setNewsCounter(newsData?.data?.length);

    }, [newsData?.data]);


    const changeTopic = (newTopic) => {

        navigate(`/news/${newTopic}/1`);

    }

    const scrollRight = (type) => {

        const rt = document.getElementById('newsTopic');
        if(type === 'left'){
          rt.scrollLeft += 250
        }else{
          rt.scrollLeft -= 250
        }
    }

if (newsData.error) {

    console.log(newsData.error.message)
    return <div className="loaderPage"><Loader/></div>

}

if (newsData.isLoading || categoryData.isLoading) return <div className="loaderPage"><Loader/></div>

  return (
      
    <div className="news_body">

        <div className="news">

            <div className="news_tag"> 

                <Container>

                    <div className="containerWrap flex">

                        <div className="arrowNavigation" onClick={()=>scrollRight('right')}> <NavArrowLeft/> </div>

                        <div className="newsTopic flex" id='newsTopic'>

                            <div className={`news_tagging ${topic === "all" ? "active" : ""} `} onClick = { () => changeTopic("all") } > All </div>

                            {
                                categories?.length ? categories.map( (res, index) => {

                                    return <div className={`news_tagging ${res.name === topic ? "active" : ""} `} onClick = { () => changeTopic(res.name) } key = {index} > {res.name} </div>

                                }) : null
                            }

                        </div>

                        <div className="arrowNavigation" onClick={()=>scrollRight('left')}> <NavArrowRight/> </div>

                    </div>

                </Container>
            
            </div>

            <div className="news__show__body">

                <NewsComp data = {newsData.data?.data} topic = {topic} />

                {
                    newsData.data?.length > 1 ? <Pagination size = {size} page = {page} topic = {topic} /> : null
                } 

            </div>

        </div>  

    </div>

  )


}
