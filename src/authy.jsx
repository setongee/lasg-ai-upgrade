import React, {useState, useEffect} from 'react'
import './authy.scss'
import App from './App';

export default function Authy() {

    const [error, setError] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const access = "#eko__passkey__secure__007__blackOps#";

    const handleSub = () => {

        const accessEle = document.getElementById('access').value;

        if (accessEle === ''){

           middle("All fields are required!", "bad");
           
           

        } else if (accessEle !== access) {

            middle( "Invalid / Unathorized Login", "bad")

        } else {

            window.sessionStorage.setItem('lasg_token', access);
            middle("Login Successful!", "ok");
            
            setTimeout(() => {

                setIsValidated(true)
                
            }, 2000);

        }

    }

    const middle = (message, status) => {


        const accessElement = document.getElementById('access');
        const errorElement = document.getElementById('error');

        setError(message);
        accessElement.classList.add(status);
        errorElement.classList.add(status)

        setTimeout(() => {

            setError('');
            accessElement.classList.remove(status);
            errorElement.classList.add(status)
            
        }, 3000);

    }

    useEffect(() => {


        const db = window.sessionStorage.getItem('lasg_token');
        
        if (db && db === access) {

            setIsValidated(true);

        } else {

            setIsValidated(false);

        }
        
        
    }, [isValidated]);

  return (

    <div className="appHome">

        {
            isValidated 

            ? <App/> 

            :

            (
                <div className="authPage">

                    <div className="loginPart">

                        <div className="topicTitle"> Hello LASG,  {<br></br>} Enter access code... </div>

                        <div className="form"> 

                            <input type="text" placeholder='Enter LASG Webapp V2 access code' id = 'access' />
                            <div className="submitBtn" onClick={ ()=>handleSub() }>Submit</div>

                        </div>

                        <div className="errorZone" id='error'> {error} </div>

                    </div>

                </div>

            )
        }

        

    </div>

  )

}
