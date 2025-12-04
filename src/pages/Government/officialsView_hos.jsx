import React from 'react'
import './officials.scss'
import { useParams } from 'react-router'
import Container from '../../components/container/container';
import { DownloadCircle } from 'iconoir-react/solid';
import { Send } from 'iconoir-react';

import { useQuery } from '@tanstack/react-query'
import { getSingleMember } from '../../api/read/executives.req';
import Loader from '../../components/loader/loader';

export default function HOSView() {

let params = useParams();

const {isLoading, data} = useQuery({

    queryKey: ["exec"],
    queryFn: () => getSingleMember("6797e25f984d6e2dadb77ecb")

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

            <p onClick={ () => window.location.href = '/government/elected_officials/cos/view'  } >Chief of Staff</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/dcos/view'  } >Deputy Chief of Staff</p>

        </div>

        <div className="officials_body">

            <Container>
                
                <div className="viewport">

                    <div className="official_details">

                        <div className="official_name"> {data?.data?.fullname} </div>
                        <div className="post"> - {data?.data?.position} - </div>
                        <div className="shortBio">Mr. Agoro, Shuaheeb, Olabode, the last born of five, was born on the 3rd of August 1967 to the family of late Justice Idowu Olayimika Agoro, the first Solicitor General / Permanent Secretary, Lagos State Ministry of Justice and retired Justice of the Court of Appeal...</div>

                    </div>

                    <div className="official_photo">
                        <img src={data?.data?.photo} alt = {`${data?.data?.fullname} - ${data?.data?.position} of Lagos State official photo`} />
                    </div>

                    <div className="downloadPortrait" onClick={ () => window.open(data?.data?.photo) } > <DownloadCircle/> Download Official Portrait </div>

                    <div className="official_highlights">

                        <div className="title">Head of Service in action</div>

                        <div className="highlights">

                            <div className="highlight">
                                <img src="https://metrowatchonline.com/wp-content/uploads/2023/10/PIX-5103.jpg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://echonews.ng/wp-content/uploads/2023/10/IMG-20231003-WA0170-1.jpg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://mmo.aiircdn.com/370/65264e7f53379.jpg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://pbs.twimg.com/media/GMB-o1fWwAAFSu4?format=jpg&name=large" alt="highlight" />
                            </div>

                        </div>

                    </div>

                    <div className="missionStatement">

                        "it is important we make sure that as workers we engage in regular exercise to make our body fit and sound..."

                        <p>- Mr. Agoro Shuaheeb Olabode</p>

                    </div>

                    <div className="official_bio">

                    <p>
                    
                    <div className='heading' id="intro"> About Head of Service </div>
                    
                    Mr. Agoro, Shuaheeb, Olabode, the last born of five, was born on the 3rd of August 1967 to the family of late Justice Idowu Olayimika Agoro, the first Solicitor General / Permanent Secretary, Lagos State Ministry of Justice and retired Justice of the Court of Appeal (one of the four musketeers, others being Adeyemi-Bero, Howson Wright, and FCO Coker) and late Alhaja Ganiat Remilekun Agoro (Nee Shitta), a Retired Civil Servant and Nurse at the General Hospital, Lagos..   </p>                    
                    
                    
                    <p>

                        <div className='heading' id="education">Educational Background</div>
                        
                        He began his education at Corona Primary School, Victoria Island and proceeded to St. Gregory’s College Lagos for his O and A Levels Education
                    
                    </p>
                    
                    <p>
                        He gained admission into Lagos State University to study Political Science but later left for Park Lane College, Leeds, England to study for the Access Course in Law. He thereafter, gained admission to Leeds Metropolitan University, Leeds, England where he obtained his Bachelor of Law degree (Second Class Upper Division)
                    </p>

                    <p>
                        He thereafter, attended the Nigerian Law School and was called to the Nigerian Bar in 1996. Between September 1998 – February 2000 he attended the University of Dundee, Scotland, Centre for Energy Petroleum Mineral Law and Policy to undertake an LL.M in Petroleum Law and Policy, where he obtained Second Class Upper Division degree and a Distinction in his Thesis titled “Expanding The Nigerian Upstream Oil Industry Through
                        Restructuring / Privatisation”.
                    </p>

                    <p>
                        In May 2002, Mr. Agoro passed the Qualified Lawyers Transfer Test at the BPP Law School, England, United Kingdom and was thereupon admitted to practice
                        as a Solicitor in England and Wales. Between 2 July and 16 August 2006, he attended John F. Kennedy School of Government, Harvard University, Cambridge, Massachusetts, USA for an Executive Education Course on Public Private Partnership: Infrastructure in a Market Economy.
                    </p>

                    <p>
                        Mr. Agoro also attended University of Oxford, England, United Kingdom, in November 2022 for
                        an Executive Education Certificate in Real Estate
                    </p>

                    <p>

                        <div className='heading' id="qualifications"> Qualifications </div>

                        Prior to joining the Public Service, Mr. Agoro had a stint in the Private Sector. He worked as a Solicitor & Barrister at F.O. Akinrele & Co. (SAN) Lagos, from 1996 to 1998 and then worked at Legal Technologies Limited, London, UK as a Para Legal Officer from March 2000 to August 2000 (after his LL.M studies). He later joined Denton Wilde Sapte (Solicitors) in the United Kingdom from August 2000 to July 2003 as an Energy Lawyer. In July 2003, 

                        {<br></br>} {<br></br>}
                    
                        Mr. Agoro joined the Lagos State Government as a Senior Special Assistant to the Governor (Lands). In October 2003 he was elevated to head the Directorate of Land Services, Lands Bureau and was later absorbed into the Mainstream Civil Service in 2007 as Director (Administration) and redeployed to Lands Bureau as Director, Land Regularization, a position he held from 2007 to 2015 before his appointment as Permanent Secretary in August 2015. He served as Permanent Secretary Lands Bureau for eight years till his appointment as the 22nd Head of Service in September, 2024.
                    
                        {<br></br>} {<br></br>}
                    
                    </p>


                    </div>

                </div>

            </Container>

        </div>

    </div>

  )

}
