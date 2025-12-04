import React,{useState, useEffect} from 'react'
import './events.scss'
import Container from '../../components/container/container'
import calender from '../../assets/icons/random/calendar.png'
import aot from  '../../assets/events/aot6.0.png'
import { getAllEvents } from '../../api/read/events.req'
import Loader from '../../components/loader/loader'
import { useNavigate, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import EventCard from './eventCard'

export default function Events() {

    let navigate = useNavigate();
    
    const {page, topic} = useParams();
    const [size, setSize] = useState( { length : 0, pageCount : 0 } );
    const [eventCounter, setEventCounter] = useState(0);

    
    const eventData = useQuery({

        queryKey: ["events", page, topic],
        queryFn: () => getAllEvents(topic, (Number(page - 1)))

    })

    useEffect(() => {
        
       window.scroll(0,0);

       setSize({
        
        length : eventCounter,
        pageCount : parseInt(eventCounter / 20) + 1

      });

    }, [page, topic, eventCounter]);

    useEffect(() => {
        
        setEventCounter(eventData?.data?.length);

    }, [eventData?.data]);


    // const changeTopic = (newTopic) => {

    //     navigate(`/events/${newTopic}/1`);

    // }

    // const scrollRight = (type) => {

    //     const rt = document.getElementById('newsTopic');
    //     if(type === 'left'){
    //       rt.scrollLeft += 250
    //     }else{
    //       rt.scrollLeft -= 250
    //     }
    // }

if (eventData.error) {

    console.log(eventData.error.message)
    return <div className="loaderPage"><Loader/></div>

}

if (eventData.isLoading || eventData.isLoading) return <div className="loaderPage"><Loader/></div>

  return (

    <div className="events">

        <Container>

            <div className="events__body">

                <div className="events__body__title"> Lagos State Events </div>
                
                <div className="events">

                    {
                        eventData?.data?.data?.length ? eventData?.data?.data.map( (data, index) => {

                            return <EventCard key = {data._id} data = {data} />

                        } ) : <div className="emptyTray uppercase"> Sorry there are no upcoming events </div>
                    }
                    
                </div>

            </div>

        </Container>

    </div>

  )

}
