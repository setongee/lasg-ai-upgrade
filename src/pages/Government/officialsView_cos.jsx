import React from 'react'
import './officials.scss'
import { useParams } from 'react-router'
import Container from '../../components/container/container';
import { DownloadCircle } from 'iconoir-react/solid';
import { Send } from 'iconoir-react';

import { useQuery } from '@tanstack/react-query'
import { getSingleMember } from '../../api/read/executives.req';
import Loader from '../../components/loader/loader';

export default function COSView() {

let params = useParams();

const {isLoading, data} = useQuery({

    queryKey: ["exec"],
    queryFn: () => getSingleMember("6797e34d984d6e2dadb77f06")

})

if(isLoading) return <div className="fullPortion"><Loader/></div>

return (

    <div className="officialViews">

        <div className="sideMenu">

            <p> See Also <Send/> </p>

            <p onClick={ () => window.location.href = '/government/elected_officials'  } > View Administration </p>

            <p onClick={ () => window.location.href = '/government/elected_officials/governor/view'  } > Executive Governor</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/deputy_governor/view'  } > Deputy Governor</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/ssg/view'  } >Sec. to the State Gov.</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/hos/view'  } >Head of Service</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/dcos/view'  } >Deputy Chief of Staff</p>

        </div>

        <div className="officials_body">

            <Container>
                
                <div className="viewport">

                    <div className="official_details">

                        <div className="official_name">{data?.data?.fullname} </div>
                        <div className="post"> -{data?.data?.position} - </div>
                        <div className="shortBio">Mr. ‘Tayo Akinmade Ayinde was born on the 24th of August 1964 at Alausa, Ikeja, Lagos. He attended St Peters’ Anglican Primary School, Alausa, Ikeja where he obtained ...</div>

                    </div>

                    <div className="official_photo">
                        <img src={data?.data?.photo} alt = {`${data?.data?.fullname} - ${data?.data?.position} of Lagos State official photo`} />
                    </div>

                    <div className="downloadPortrait" onClick={ () => window.open(data?.data?.photo) } > <DownloadCircle/> Download Official Portrait </div>

                    <div className="official_highlights">

                        <div className="title"> Chief of Staff in action</div>

                        <div className="highlights">

                            <div className="highlight">
                                <img src="https://media.licdn.com/dms/image/D4D22AQGN-71Aermwag/feedshare-shrink_800/0/1687225541093?e=2147483647&v=beta&t=u_qQxA0qZvea3d0j1mMiY1tcFpdX77ySH2F_1pidoxE" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://ajasainfo.files.wordpress.com/2021/08/fb_img_1629817036908.jpg?w=720" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://kosofepost.com/wp-content/uploads/2021/08/FB_IMG_1629820470838.jpg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://tbiafrica.com/wp-content/uploads/2019/06/Sanwo-Olu-swears-in-SSG-Chief-of-Staff.jpg" alt="highlight" />
                            </div>

                        </div>

                    </div>

                    <div className="missionStatement">

                        "People always want welfare, development, and good governance. I'm happy that Lagos delivers all these and lagosians agree with us..."

                        <p>- Mr. Tayo Akinmade Ayinde</p>

                    </div>

                    <div className="official_bio">

                    <p>
                    
                    <div className='heading' id="intro"> About Mr. Tayo Akinmade Ayinde </div>
                    
                    Mr. ‘Tayo Akinmade Ayinde was born on the 24th of August 1964 at Alausa, Ikeja, Lagos. He attended St Peters’ Anglican Primary School, Alausa, Ikeja where he obtained his First School Leaving Certificate. He also attended Ogudu Grammar School, Ojota, Lagos where he sat and obtained his West African School Certificate.   </p>

                    

                    

                    <p>

                    <div className='heading' id="Public Service">Public Service</div>

                    <div className="imp_img">

                         <div className="imageContainer">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp1zw1ygMV-Eag8MtnY5KCzTOne8qTe2_TApJ7Kj_VtpRpBOMQxOp6oo-i6RE4iZwbAy4&usqp=CAU" alt="hamzat Elections" /> 
                         </div>

                         <div className="imageContainer">
                            <img src="https://i0.wp.com/sunrise.ng/wp-content/uploads/2019/06/Tayo.jpg?fit=1012%2C485&ssl=1" alt="sanwolu2019 Elections" /> 
                         </div>

                    </div>
                        
                    He was appointed the Chief of Staff to Governor Sanwo-Olu on June 6, 2019 and has contributed significantly to the realization of the present administration’s commitment to the Greater Lagos Agenda. As the Chief of Staffand a member of the state executive committee, he took an active part in strategic policies that improved the performance of Lagos State Internal Revenue Services amongst relevant Agencies.</p>

                    
                   
                    
                    <p>

                    <div className='heading' id="education">Educational Background</div>
                        
                    He was admitted into Federal Polytechnic, Anambra from where he was awarded the Ordinary National Diploma (OND) in Banking and later the Higher National Diploma (HND) in Accountancy.</p>

                    <p>
                    Mr. Ayinde holds a Master’s Degree (MBA) in Financial Management from Lagos State University. He also attended University of Toronto, Rotman School of Management, where he underwent a Course of Study in Strategic Thinking Approach. He later attended the University of Cambridge, Judge Business School for a Course of Study in Business Model Innovation. Not done still, he went further to study Strategic Financial Analysis for Business Evaluation at Harvard Business School, Boston, USA. All these were in addition to his professional training on VIP protection and anti-terrorism in the best Institutions in Israel and the UK, he is a Fellow of Chartered Institute of Public Diplomacy and Management and an Associate Member of Chartered Institute of Taxation.
                    </p>

                    <p>

                    <div className='heading' id="qualifications"> Qualifications </div>

                    <p>Prior to his appointment as the Chief of Staff, he worked briefly with TELL Magazine as Account Officer in 1993. In that same year, he joined the State Security Service (SSS) in which ranks he distinguished himself as a dedicated, loyal, courageous and trustworthy Officer till he retired meritoriously in 2009.</p>

                    
                    
                    
                    <div className='heading' id="highlights">Highlights & Contributions</div>

                    While in the SSS, Mr. Ayinde was Head of the Accounts Department of State Security Service (SSS) Shangisha Office from 1993 – 1999. He later worked with the former Governor of Lagos State, His Excellency Governor Emeritus Jagaban Borgu the Asiwaju Bola Ahmed Tinubu as Chief Security Detail.</p>

                    <p>
                    A committed supporter of universal human values and an advocate of support for the less privileged, Mr. Tayo Ayinde has touched many lives for the better. In a bid to deploy his immense capacity for service to humanity, Tayo Ayinde delved fully into politics in 2009. He was a two term Director- General for Mr. Babajide Olusola Sanwo-Olu and Dr. Kadri Obafemi Hamzat’s Independent Campaign Group in 2019 and 2023, and later Chairman of the Inauguration Committee in 2019 as well as 2023.
                    </p>

                    </div>

                </div>

            </Container>

        </div>

    </div>

  )

}
