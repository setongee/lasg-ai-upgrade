import React from 'react'
import './officials.scss'
import { useParams } from 'react-router'
import Container from '../../components/container/container';
import { DownloadCircle } from 'iconoir-react/solid';
import { Send } from 'iconoir-react';

import { useQuery } from '@tanstack/react-query'
import { getSingleMember } from '../../api/read/executives.req';
import Loader from '../../components/loader/loader';

export default function SSGView() {

let params = useParams();

const {isLoading, data} = useQuery({

    queryKey: ["exec"],
    queryFn: () => getSingleMember("6797e22c984d6e2dadb77ebe")

})

if(isLoading) return <div className="fullPortion"><Loader/></div>

return (

    <div className="officialViews">

        <div className="sideMenu">

            <p> See Also <Send/> </p>

            <p onClick={ () => window.location.href = '/government/elected_officials'  } > View Administration </p>

            <p onClick={ () => window.location.href = '/government/elected_officials/governor/view'  } > Executive Governor</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/deputy_governor/view'  } > Deputy Governor </p>

            <p onClick={ () => window.location.href = '/government/elected_officials/hos/view'  } >Head of Service</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/cos/view'  } >Chief of Staff</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/dcos/view'  } >Deputy Chief of Staff</p>



        </div>

        <div className="officials_body">

            <Container>
                
                <div className="viewport">

                    <div className="official_details">

                        <div className="official_name"> {data?.data?.fullname} </div>
                        <div className="post"> - {data?.data?.position} - </div>
                        <div className="shortBio">Mrs. Abimbola Salu-Hundeyin is an esteemed Nigerian lawyer, administrator, and public servant, whose career spans over three decades of dedicated service to the nation. A Solicitor of the Supreme Court of Nigeria...</div>

                    </div>

                    <div className="official_photo">
                        <img src={data?.data?.photo} alt = {`${data?.data?.fullname} - ${data?.data?.position} of Lagos State official photo`} />
                    </div>

                    <div className="downloadPortrait" onClick={ () => window.open(data?.data?.photo) } > <DownloadCircle/> Download Official Portrait </div>

                    <div className="official_highlights">

                        <div className="title">Secretary to the State Government in action</div>

                        <div className="highlights">

                            <div className="highlight">
                                <img src="https://pbs.twimg.com/media/FywELqqXwAMaO1O.jpg:large" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://pbs.twimg.com/media/Fyx1JP6XsAgA6DI?format=jpg&name=4096x4096" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://i0.wp.com/lagosstate.gov.ng/wp-content/uploads/2023/11/2d3ba3f0-c4a7-4b05-b974-6db69b42eb3d.jpeg?resize=780%2C520&ssl=1" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://ssg.lagosstate.gov.ng/wp-content/uploads/sites/131/2023/11/6f39f8f6-4796-4e83-bb24-341b4224a1b5.jpeg" alt="highlight" />
                            </div>

                        </div>

                    </div>

                    <div className="missionStatement">

                        "Lagos is the only state that is not owing pensioners a kobo, if you retire today, you begin to get your pension immediately..."

                        <p> - Barr. ‘Bimbola Salu-Hundeyin </p>

                    </div>

                    <div className="official_bio">

                    <p>
                    
                    <div className='heading' id="intro"> About Barr. ‘Bimbola Salu-Hundeyin </div>
                    
                    Mrs. Abimbola Salu-Hundeyin is an esteemed Nigerian lawyer, administrator, and public servant, whose career spans over three decades of dedicated service to the nation. A Solicitor of the Supreme Court of Nigeria, she holds a Bachelor of Laws degree from Obafemi Awolowo University (OAU), Ile-Ife, where she graduated in 1984. </p>

                    <p>She further solidified her legal acumen by establishing her practice as the Principal Counsel of A & H Abimbola Hundeyin and Co., where she demonstrated her profound expertise in various aspects of law. Her public service journey is marked by significant contributions across various sectors. 
                    </p>

                    

                    <p>

                    <div className='heading' id="Public Service">Public Service</div>

                    <div className="imp_img">

                         <div className="imageContainer">
                            <img src="https://pbs.twimg.com/media/Fy0CmF7WIAAbvk6.jpg" alt="SSG Elections" /> 
                         </div>

                         <div className="imageContainer">
                            <img src="https://ssg.lagosstate.gov.ng/wp-content/uploads/sites/131/2023/06/IMG-20230616-WA0008.jpg" alt="sanwolu2019 Elections" /> 
                         </div>

                    </div>
                        
                    Mrs. Salu-Hundeyin initially made her mark as the Special Adviser (Legal) to the Minister of the Federal Capital Territory (FCT), Senator Bala Muhammad. In this capacity, she provided critical legal counsel and played an instrumental role in shaping policies that impacted the nation's capital. Mrs. Salu-Hundeyin's leadership skills were further recognized when she served as the Acting Chairman of the National Population Commission (NPC).</p>

                    <p>Her tenure was marked by strategic reforms and initiatives that bolstered the commission's mandate. Subsequently, she was confirmed as one of the 12 National Commissioners of the NPC, further cementing her reputation as an astute administrator. 
                    </p>

                    <p>Her expertise in population management earned her the prestigious role of Chairperson of the African Union-African Population Experts Committee (AU-APEC), where she continues to contribute to continental policies on population and development.
                    </p>

                    <p>In a testament to her versatile leadership, Mrs. Salu-Hundeyin currently serves as the Secretary to the State Government (SSG) under the administration of Governor Babajide Olusola Sanwo-Olu. In this role, she oversees the coordination of government activities, ensuring the effective implementation of policies and programs that align with the administration's vision for Lagos State.
                    </p>
            

                    <p>
                    
                    <div className='heading' id="highlights">Highlights & Contributions</div>

                    Mrs. Abimbola Salu-Hundeyin is widely respected for her legal brilliance, administrative acumen, and unwavering commitment to public service. Her career reflects a deep dedication to advancing the legal profession and improving governance, making her a significant figure in Nigeria's public sector landscape.</p>                

                    </div>

                </div>

            </Container>

        </div>

    </div>

  )

}
