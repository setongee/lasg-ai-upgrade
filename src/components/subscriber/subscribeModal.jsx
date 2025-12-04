import React, {useEffect, useState} from 'react'
import './subscribeModal.scss'
import LASG_SERVICES from '../../api/data/services';
import Container from '../container/container';
import { SplitText } from '../../pages/home/SplitText';

export default function SubscribeModal({closeSubscribe}) {

  const [interests, setInterests] = useState([]);

  useEffect(() => {

    document.body.style.overflowY = 'hidden'

  }, []);

  return (

    <div className="subscribeModal">

        <Container>

            <div className="modal">

                <div className="persona">

                    <div className="lasg__topic uppercase">Email Subscription - New</div>

                    <div className="greeting">
                        <SplitText

                            major = "many"
                            initial={{ y: '100%' }}
                            whileInView={{ y: 0,
                            transition: { duration : 1.4 }}}   
                        >
                        
                        Stay up-to-date with the latest news and events by setting up your interests!

                        </SplitText>

                    </div>

                    <div className="personalInfo">

                        <p>Kindly fill your information</p>

                        <div className="inputForm">
                            <label>Fullname</label>
                            <input type="text" placeholder='Enter fullname' />
                        </div>

                        <div className="inputForm">
                            <label>Email Address</label>
                            <input type="email" placeholder='Enter email address' />
                        </div>

                        

                    </div>

                </div>

                <div className="interests__body">

                    <p>Choose Interests.</p>

                    <div className="interests">

                        {
                            LASG_SERVICES.map(res => (

                                <label className="interest">

                                    <div className="title">{res.title}</div>
                                    <input type="checkbox"/>
                                    <span className="checkmark"></span>

                                </label>

                            ))
                        }

                    </div>

                </div>

                <div className="buttons__galor">

                    <div className="submit__btn cancel" onClick = { () => closeSubscribe() } >Cancel</div>
                    <div className="submit__btn" onClick = { () => closeSubscribe() }> Submit Interests </div>

                </div>

            </div>

        </Container>

    </div>

  )

}
