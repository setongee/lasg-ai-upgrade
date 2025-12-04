import React, {useState, useEffect} from 'react'
import { registerEvent } from '../../api/read/events.req';
import { Xmark } from 'iconoir-react';
import { formatDate3 } from '../../middleware/middleware';

const EventForm = ({close, data}) => {

    const [status, setStatus] = useState("default");
    const [message, setMessage] = useState("");
    
    // form
    const [ email, setEmail ] = useState("");
    const [ fullname, setFullname ] = useState("");

    const handleRegister = () => {

        setStatus("pending")
        const date = formatDate3(new Date);
    
        if (email === "" || fullname === "" ) {
            setMessage("All fields are required!")
    
            setTimeout(() => {
                setMessage("")
            }, 2000);
        }
        else {
    
           if(status === "default"){
    
                registerEvent(data._id, { email, fullname, date } )
                .then(e=> {
                    if(e.status === "ok"){
    
                        setMessage(e.message);
    
                        setTimeout(() => {
    
                            setEmail("");
                            setFullname("");
                            setStatus("default");
                            setMessage("");
                            close(false);
                            
                        }, 2000);
                    }
                    else{
    
                        setMessage(e.message);
                        
                        setTimeout(() => {
    
                            setStatus("default");
                            setMessage("");
                            
                        }, 2000);
    
                    }
                })
    
           }
    
        }
    
    }

  return (

    <div className="registerEvent">

        <div className="registrationCard">

            <div className="title"> 
                Register for Event 
                <div className='arry' onClick={ () => close(false) } ><Xmark/></div>
            </div>

            <form>

                <div className="formation">
                    <label htmlFor="fullname">Fullname</label>
                    <input type="text" name = "fullname" placeholder='Enter fullname' value={fullname} onChange={ e => setFullname(e.target.value) } />
                </div>

                <div className="formation">
                    <label htmlFor="email">Email</label>
                    <input type="email" name = "email" placeholder='Enter email' value={email} onChange={ e => setEmail(e.target.value) } />
                </div>

                <div className="submitEvent" onClick={handleRegister} > Register </div>

            </form>

            {
                message !== "" ? <div className="message">{message}</div> : null
            }

        </div>

    </div>

  )

}

export default EventForm
