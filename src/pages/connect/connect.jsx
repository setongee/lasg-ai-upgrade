import React from 'react'
import Container from '../../components/container/container'
import './connect.scss'
import { Facebook, Instagram, Linkedin, X, Youtube } from 'iconoir-react'

export default function Connect() {

  return (

    <div className="connect">

        <Container>

            <div className="connect__pages">

                <div className="connect__contact">

                    <div className="connect__heading">

                        Connect with Lagos

                        <p>Send a message to the email address below to get in touch.</p>

                    </div>

                    <div className="action__connect">


                          <div className="email"> <a href="mailto:info@lagosstate.gov.ng"> info@lagosstate.gov.ng </a> </div>

                          <div className="address"> 
                            
                            <p>The Secretariat, Obafemi Awolowo way, Ikeja, Lagos State, Nigeria.</p> 

                            <a target = '_blank' href="https://www.google.com/maps/dir//Lagos+State+Secretariat+-+Alausa,+Obafemi+Awolowo+Way,+Oregun,+Ikeja+101233,+Lagos/@6.5765376,3.3390592,13z/data=!4m9!4m8!1m0!1m5!1m1!1s0x103b93a333810f2f:0x6f664872f21b48bd!2m2!1d3.3596427!2d6.6169887!3e0?entry=ttu">Get directions</a>

                          </div>

                          <div className="social__media">

                              <p>Follow Lagos State</p>

                              <div className="socials__icons">

                                  <a target= '_blank' href='https://www.instagram.com/lagosstategovt/?hl=en' className="soc insta"><Instagram/></a>
                                  <a target= '_blank' href = 'https://x.com/followlasg' className="soc x"><X/></a>
                                  <a target= '_blank' href='https://web.facebook.com/followlasg' className="soc fb"><Facebook/></a>
                                  <a target= '_blank' href='https://www.linkedin.com/company/lagosstategovernment/?originalSubdomain=ng' className="soc linkdn"><Linkedin/></a>
                                  <a target= '_blank' href='https://youtube.com/@lasgpage' className="soc yt"><Youtube/></a>

                              </div>

                          </div>


                    </div>

                </div>

            </div>

        </Container>

    </div>

  )
}