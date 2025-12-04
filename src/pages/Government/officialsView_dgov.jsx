import React from 'react'
import './officials.scss'
import { useParams } from 'react-router'
import Container from '../../components/container/container';
import { DownloadCircle } from 'iconoir-react/solid';
import { Send } from 'iconoir-react';

import { useQuery } from '@tanstack/react-query'
import { getSingleMember } from '../../api/read/executives.req';
import Loader from '../../components/loader/loader';

export default function DGovernorsView() {

let params = useParams();

const {isLoading, data} = useQuery({

    queryKey: ["exec"],
    queryFn: () => getSingleMember("6797e207984d6e2dadb77eb6")

})

if(isLoading) return <div className="fullPortion"><Loader/></div>

return (

    <div className="officialViews">

        <div className="sideMenu">

            <p> See Also <Send/> </p>

            <p onClick={ () => window.location.href = '/government/elected_officials'  } > View Administration </p>

            <p onClick={ () => window.location.href = '/government/elected_officials/governor/view'  } > Executive Governor</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/ssg/view'  } >Sec. to the State Gov.</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/hos/view'  } >Head of Service</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/cos/view'  } >Chief of Staff</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/dcos/view'  } >Deputy Chief of Staff</p>



        </div>

        <div className="officials_body">

            <Container>
                
                <div className="viewport">

                    <div className="official_details">

                        <div className="official_name">{data?.data?.fullname}</div>
                        <div className="post"> - {data?.data?.position} - </div>
                        <div className="shortBio">Dr. Kadri Obafemi Hamzat, was re-elected the Deputy Governor of Lagos State for a second term, following the victory of the All Progressives Congress (APC) at the March 18, 2023 gubernatorial election. He remained the running mate to the Governor...</div>

                    </div>

                    <div className="official_photo">
                        <img src={data?.data?.photo} alt = {`${data?.data?.fullname} - ${data?.data?.position} of Lagos State official photo`} />
                    </div>

                    <div className="downloadPortrait" onClick={ () => window.open(data?.data?.photo) } > <DownloadCircle/> Download Official Portrait </div>

                    <div className="official_highlights">

                        <div className="title">Deputy Governor in action</div>

                        <div className="highlights">

                            <div className="highlight">
                                <img src="https://ikejarecord.com/wp-content/uploads/2023/08/Untitled-design-1.jpg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://www.vmcdn.ca/f/files/alimoshotoday/images/5692.jpg;w=824" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://pbs.twimg.com/media/GFL1dgrWYAAsOdu.jpg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://pbs.twimg.com/media/GJyN8EeWQAAbn1k.jpg:large" alt="highlight" />
                            </div>

                        </div>

                    </div>

                    <div className="missionStatement">

                        "Lagos is committed to providing the youth with ‘cutting-edge’ facilities and technology, thereby, empowering them to reach their full potential, including the desire to drive innovation and growth in the state"

                        <p>- Dr. Kadri Obafemi Hamzat</p>

                    </div>

                    <div className="official_bio">

                    <p>
                    
                    <div className='heading' id="intro"> About Deputy Governor Hamzat </div>
                    
                    Dr. Kadri Obafemi Hamzat, was re-elected the Deputy Governor of Lagos State for a second term, following the victory of the All Progressives Congress (APC) at the March 18, 2023 gubernatorial election. He remained the running mate to the Governor, Mr. Babajide Olusola Sanwo-Olu after an outstanding first term performance.   </p>

                    <p>Born on September 19, 1964, ideologically progressive Dr. Hamzat joined the public service in 2005 from an impressive career in academics, financial services and engineering with accomplishments in information technology and consulting. Ever since then, he has increasingly established as a visionary leader with an impressive focus on excellence and performance. </p>

                    

                    <p>

                    <div className='heading' id="Public Service">Public Service</div>

                    <div className="imp_img">

                         <div className="imageContainer">
                            <img src="https://pbs.twimg.com/media/F8N5KwQXQAA2AEy.jpg:large" alt="hamzat Elections" /> 
                         </div>

                         <div className="imageContainer">
                            <img src="https://pbs.twimg.com/media/GIeZdpBWIAAwjKq.jpg:large" alt="sanwolu2019 Elections" /> 
                         </div>

                    </div>
                        
                    Dr. Hamzat brought his energy and vitality into public service after over 2 decades of an exciting private sector career across various top positions in reputable organizations such as RTP Consulting Services, City of New York, College of New Rochelle, New York, Merrill Lynch Inc., Morgan Stanley and Oando Plc.</p>

                    <p>While on his first public sector role, his headship as Commissioner at the Ministry of Science & Technology during the Bola Ahmed Tinubu administration, entrenched a new work culture among the staff who embraced his style of open and transparent leadership with enthusiasm.</p>

                    <p>In only four years, he deployed cutting-edge technology that integrated the entire Lagos State Public Service, and with that initiative, Lagos became the first government institution in Africa to implement 11 modules of Oracle ERP. On the strength of his performance, he was retained in the first term of Babatunde Fashola administration (2007-2011) to continue with the technological innovation that brought such efficiency to government activities in Lagos State. </p>

                    <p>In the second term of the administration (2011 to 2015), Dr. Hamzat was appointed Commissioner for Works and Infrastructure to champion the State’s infrastructural revolution agenda. He later served as Special Adviser (Technical) to His Excellency, Mr. Babatunde Raji Fashola, when he became the Honourable Minister of Works, Power and Housing before his nomination and subsequent election as the Deputy Governor of Lagos State in 2019.</p>
                    
                    
                    <p>

                    <div className='heading' id="education">Educational Background</div>
                        
                    Dr. Hamzat had his early education at Odu Abore Memorial Primary School in Mushin and Olivet Baptist High School, Oyo. For his tertiary education, he attended the Prestigious University of Ibadan, graduated with a B.Sc. (Second Class Upper) in Agricultural Engineering in 1986 and earned a M.Sc. in Agricultural Engineering in 1988 from the same University.</p>

                    <p>
                    In 1992, he earned a Ph.D. in System Process Engineering from Cranfield University, England and was the first student in the department to complete his doctorate within three years. He is also an alumnus of the Harvard Kennedy School of Government.
                    </p>

                    <p>

                    <div className='heading' id="qualifications"> Qualifications </div>

                    Dr. Hamzat, who has two publications in reputable Scientific Journals to his name, is a Microsoft Certified System Engineer, a member of the Nigeria Computer Society and a Fellow of Nigerian Society of Engineers. He has gained further exposure through numerous training programme by international giants. One of such instances is his participation in the World Bank’s Third Country Training Programme held in Singapore which emphasized a holistic understanding of the challenges facing the developing nations of the world.
                    
                    {<br></br>} {<br></br>}

                    A well-rounded Public Administrator, Dr. Hamzat is a strategic thinker, who has coordinated the execution of numerous world-class projects and developmental programs towards transforming Lagos State into Africa’s model megacity and financial hub. He is a doer, who pushes the boundaries of excellence in public service without seeking undue limelight and only finds joy in his public office achievements, only when his efforts impact lives positively while serving the overall public interest.</p>

                    <p>
                    
                    
                    
                    <div className='heading' id="highlights">Highlights & Contributions</div>

                    Highly revered and extensively decorated for his efficient resource utilization in the private sector and gallantry in public service, he was the winner of the 2013 edition of the Lagos State Man of the Year Award.</p>

                    <p>Beyond accolades, Dr. Hamzat’s extensive knowledge and leadership ability have earned him important seats at critical decision-making and advisory tables both in the state and countrywide.  He has also delivered papers and lectures at various fora.</p>

                    <p>
                    
                    <div className='heading' id="family"> Hamzat's Family</div>

                    {/* <div className="imp_img">

                         <div className="imageContainer">
                            <img src="https://pbs.twimg.com/media/GIK_rzhW4AEzEq5?format=jpg&name=large" /> 
                         </div>

                         <div className="imageContainer">
                            <img src="https://pbs.twimg.com/media/GDRfM0dXUAAKpl-?format=jpg&name=large" /> 
                         </div>

                    </div> */}
                        
                    Dr. Kadri Obafemi Hamzat is a devout Muslim and committed family man, whose marriage to Mrs. Oluremi Hamzat is blessed with lovely children. He is deeply interested in development economics, social welfare and gender empowerment, and has remained a strong voice against discriminatory policies that debase humanity.</p>

                    </div>

                </div>

            </Container>

        </div>

    </div>

  )

}
