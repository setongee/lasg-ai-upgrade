import React, {useEffect, useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './speech.scss'

import mic from '../../assets/icons/mics/mic.svg'
import micOpen from '../../assets/icons/mics/mic-open.svg'
import { MicrophoneSolid, MicrophoneSpeakingSolid } from 'iconoir-react';

const Dictaphone = ({setSpeechQuery, checkMic}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [show, setShow] = useState(false);

  useEffect(() => {
    
    setSpeechQuery(transcript);
    
  }, [transcript]);

  useEffect(() => {
    
    checkMic(transcript);

    if (listening) {

      setShow(true)

    } else if( transcript !== '' &&  window.innerWidth > 800  && window.innerHeight > 600 ) {

      setTimeout(() => {

        setShow(false)
        
      }, 2500);

    } else {
      setShow(false);
    }


  }, [listening]);

  
  if (!browserSupportsSpeechRecognition) {
    alert("Browser doesn't support speech recognition.")
  }

  return (
    <div className='mic__holder'>

        {
          show ? 
          <div className="toast_message">

          <div className="micIcon listening"> 
            <MicrophoneSpeakingSolid/> 
          </div> 

         "Speak Now..."

        </div> : null
        
        }

        <div className="trigger__mic">

            { listening ? <div className="mic listen" onClick={SpeechRecognition.stopListening} ><MicrophoneSpeakingSolid /></div> : <div className="mic" onClick={SpeechRecognition.startListening} ><MicrophoneSolid /></div> }

        </div>

    </div>
  );
};
export default Dictaphone;