import React, {useState, useEffect} from 'react'
import { formatDate3 } from '../../middleware/middleware'
import { ArrowRight } from 'iconoir-react'
import { formatDistanceToNow, isPast } from 'date-fns';
import EventForm from './eventForm';

const EventCard = ({data}) => {

const [dateStatus, setDateStatus] = useState("");
const [dateDistance, setDateDistance] = useState("");
const [isOpen, setIsOpen] = useState(false)

useEffect(() => {

    const checkDate = () => {

        const status = isPast(data.date);
        setDateStatus(status);

        const result = formatDistanceToNow(data.date);
        setDateDistance(result);

    }

    checkDate();
    
}, []);

  return (

    <div className="event__item">

        <div className="event__photo"><img src={data.photo} alt="" /></div>
        
        <div className="event__details">
            
            <div className="event__date"> { formatDate3(data.date) } </div>
            
            <div className="event__title">{data.title}</div>
            
            <div className="event__time">
                 
                {
                    dateStatus ? <div className="isPast expired"> Expired {dateDistance} ago </div> : <div className="isPast"> upcoming in {dateDistance} </div>
                }

            </div>
            
            {
                !dateStatus ? <div className="rsvp" onClick={ () => setIsOpen(true) } > Register for this event <div className='arry'><ArrowRight/></div> </div> : null
            }

        </div>

        {
            isOpen ? <EventForm close = {setIsOpen} data = {data} /> : null
        }

    </div>

  )

}

export default EventCard
