import React from 'react'
import './officials.scss'
import { useParams } from 'react-router'
import Container from '../../components/container/container';
import { DownloadCircle } from 'iconoir-react/solid';
import { Send } from 'iconoir-react';

import { useQuery } from '@tanstack/react-query'
import { getSingleMember } from '../../api/read/executives.req';
import Loader from '../../components/loader/loader';

export default function LagView() {

let params = useParams();

const {isLoading, data} = useQuery({

    queryKey: ["exec"],
    queryFn: () => getSingleMember("6797e36f984d6e2dadb77f0c")

})

if(isLoading) return <div className="fullPortion"><Loader/></div>

return (

    <div className="officialViews">

        <div className="sideMenu">

            <p> See Also <Send/> </p>

            <p onClick={ () => window.location.href = '/government/elected_officials'  } > View Administration </p>

            <p onClick={ () => window.location.href = '/government/elected_officials/governor/view'  } > Executive Governor</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/deputy_governor/view'  } > Deputy Governor </p>

            <p onClick={ () => window.location.href = '/government/elected_officials/ssg/view'  } >Sec. to the State Gov.</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/hos/view'  } >Head of Service</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/cos/view'  } >Chief of Staff</p>



        </div>

        <div className="officials_body">

            <Container>
                
                <div className="viewport">

                    <div className="official_details">

                        <div className="official_name"> {data?.data?.fullname} </div>
                        <div className="post"> - {data?.data?.position} - </div>
                        <div className="shortBio">Samuel Avwerosuo Egube, born on March 5, 1969, hails from Uwheru, Ugehelli in Delta State. He began his education at Agbado Model Primary School in Benin City, followed by Edo College in Benin City. He then earned a Second Class Upper Honours degree in Civil Engineering... </div>

                    </div>

                    <div className="official_photo">
                        <img src={data?.data?.photo} alt = {`${data?.data?.fullname} - ${data?.data?.position} of Lagos State official photo`} />
                    </div>

                    <div className="downloadPortrait" onClick={ () => window.open(data?.data?.photo) } > <DownloadCircle/> Download Official Portrait </div>


                    <div className="official_highlights">

                        <div className="title">Deputy Chief of Staff</div>

                        <div className="highlights">

                            <div className="highlight">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnvGqxudOcR8D8X7q9W9R6eyC2_UIx0puzOIEI6HWYWc1Cfl31QpZYe_oY&s=10" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScjl5Q03q6eS7jbudK9zjjqvLUlEOQOuns2l4424y6uIIlZsdiUidaYNw&s=10" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7RebP-JbKbEuAh6BgSE0KqQHtkJvG4BLo4g&usqp=CAU" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP8hKpkXYaeunmW15M3YolBYNrYfUjhEPIqQ&usqp=CAU" alt="highlight" />
                            </div>

                        </div>

                    </div>

                    <div className="missionStatement">

                        "It is a thing of joy to note that the Economic Plan of Lagos State can be duplicated for use at the national level..."

                        <p>- Mr. Sam Egube</p>

                    </div>

                    <div className="official_bio">

                    <p>
                    
                    <div className='heading' id="intro"> About Samuel Egube </div>
                    
                    Samuel Avwerosuo Egube, born on March 5, 1969, hails from Uwheru, Ugehelli in Delta State. He began his education at Agbado Model Primary School in Benin City, followed by Edo College in Benin City. He then earned a Second Class Upper Honours degree in Civil Engineering from the University of Benin. Pursuing further education, he obtained an Executive MBA from the prestigious IESE Business School at the University of Navarra, Barcelona, Spain.</p>

                    <p>

                    <div className='heading' id="education">Educational Background</div>
                        
                    A lifelong learner, Mr. Sam Egube has attended numerous professional development courses, including leadership programmes at IESE (Spain), INSEAD (France), Wharton (USA), Harvard University (USA), Columbia Business School (USA), Lagos Business School, and technical conferences such as OTC and FIDIC in Houston and Geneva, respectively. He is a member of several professional bodies, including the Institute of Directors (IoD), the Nigerian Institute of Management (NIM), the International Coaching Federation (ICF), and the Council for the Regulation of Engineering in Nigeria (COREN). He is also a Fellow of the Nigerian Society of Engineers (FNSE), the Institute of Credit Administration (FICA), and an Honorary Senior Member of the Chartered Institute of Bankers (HCIB).</p>

                    <p>
                        
                    With a remarkable 34-year career, Mr. Egube has achieved significant success in transformational banking and the public sector, consistently delivering effective results in optimizing and positioning teams and organizations for success. He served as Commissioner for Economic Planning and Budget during Governor Babajide Olusola Sanwo-Olu’s first term, beginning on August 20, 2019, where he oversaw strategic and economic policy development, resource allocation, and state-wide performance management. His dedication and contributions led to his appointment as Deputy Chief of Staff to Governor Sanwo-Olu on May 30, 2024.</p>
                 
                    <p>
                    
                    <div className='heading' id="highlights">Highlights & Contributions</div>

                    Mr. Egube is also an accomplished author, having written several books, including “Thoughts from a Wealthy Perspective,” “Relationships are Value Propositions,” and “From a Long Way.” In his leisure time, he enjoys swimming, karate (holding a black belt), and table tennis, where he was the Bendel State junior schools champion. Mr. Egube is happily married and blessed with two lovely children.</p>

                    </div>

                </div>

            </Container>

        </div>

    </div>

  )

}
