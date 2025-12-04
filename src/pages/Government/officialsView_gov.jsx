import React from 'react'
import './officials.scss'
import { useParams } from 'react-router'
import Container from '../../components/container/container';
import { DownloadCircle } from 'iconoir-react/solid';
import { Send } from 'iconoir-react';
import { useQuery } from '@tanstack/react-query'
import { getSingleMember } from '../../api/read/executives.req';
import Loader from '../../components/loader/loader';

export default function GovernorsView() {

let params = useParams();

const {isLoading, data} = useQuery({

    queryKey: ["exec"],
    queryFn: () => getSingleMember("6797e188984d6e2dadb77e90")

})

if(isLoading) return <div className="fullPortion"><Loader/></div>

return (

    <div className="officialViews">

        <div className="sideMenu">

            <p> See Also <Send/> </p>

            <p onClick={ () => window.location.href = '/government/elected_officials'  } > View Administration </p>

            <p onClick={ () => window.location.href = '/government/elected_officials/deputy_governor/view'  } >Deputy Governor</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/ssg/view'  } >Sec. to the State Gov.</p>

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
                        <div className="shortBio"> Mr. Babajide Olusola Sanwo-Olu was elected the 15th Governor of Lagos State on the platform of the All Progressives Congress (APC). He was declared winner of the March 9, 2019 gubernatorial elections by the Independent Electoral Commission (INEC) on Sunday, March 10, 2019...</div>

                    </div>

                    <div className="official_photo">
                        <img src={data?.data?.photo} alt = {`${data?.data?.fullname} - ${data?.data?.position} of Lagos State official photo`} />
                    </div>

                    <div className="downloadPortrait" onClick={ () => window.open(data?.data?.photo) } > <DownloadCircle/> Download Official Portrait </div>

                    <div className="official_highlights">

                        <div className="title">Governor in action</div>

                        <div className="highlights">

                            <div className="highlight">
                                <img src="https://pbs.twimg.com/media/F77HypMXEAAmd09.jpg:large" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://global.ariseplay.com/amg/www.arise.tv/uploads/2021/11/Sanwo-Olu-1.jpg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://res.cloudinary.com/dirmxkznt/image/upload/v1731756405/463000370_18244089694286314_4981945280962590482_n_ndr1tp.jpg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhzZ2sEyhJx7PUNpOkQphzprNRVeqkoSIK2HlA5t5Kfx7g0aHaGifHiIQBQozLzeQoPQL-aWjrMdoohvMeq_OBA5fkSJ6KWo9v7R8Vcf1VF_wA0s-cwQMTDFpbc7nCRmUwEV2amgl-hdERTUJ1BrXy-ehgZ3P73ioTsTTjbT5sjc7Zyc-mMG19WmiBI/s2048/2b.jpeg" alt="highlight" />
                            </div>

                            <div className="highlight">
                                <img src="https://www.thecable.ng/wp-content/uploads/2022/10/Sanwo-Olu.jpg" alt="highlight" />
                            </div>

                        </div>

                    </div>

                    <div className="missionStatement">

                        "The Governor of Lagos State and indeed, Lagos State Government  distances itself from any reckless, divisive and dangerous rhetoric. Lagos remains home to every Nigerian citizen regardless of their ethnic nationality"

                        <p> - Governor Babajide Olusola Sanwo-Olu </p>

                    </div>

                    <div className="official_bio">

                    <p>
                    
                    <div className='heading' id="intro">About Governor Sanwo-Olu</div>
                    
                    Mr. Babajide Olusola Sanwo-Olu was elected the 15th Governor of Lagos State on the platform of the All Progressives Congress (APC). He was declared winner of the March 9, 2019 gubernatorial elections by the Independent Electoral Commission (INEC) on Sunday, March 10, 2019 after defeating 44 other candidates who represented different parties at the election.</p>

                    <p>A product of resounding victory, His Excellency, Mr. Sanwo-Olu polled 75.6% of the total valid votes cast in the election to substantiate his legitimacy, which was further affirmed by a 72.12% vote difference between him and the next contestant.</p>

                    

                    <p>

                    <div className='heading' id="victory">Sanwo-Olu's Election</div>

                    <div className="imp_img">

                         <div className="imageContainer">
                            <img src="https://www.thecable.ng/wp-content/uploads/2022/12/20221203_162251.jpg" alt="sanwolu2019 Elections" /> 
                         </div>

                         <div className="imageContainer">
                            <img src="https://pmexpressng.com/wp-content/uploads/2019/01/PIX-6381.jpg" alt="sanwolu2019 Elections" /> 
                         </div>

                    </div>
                        
                    His victory at the election is a solid endorsement of his leadership aptitude and the All Progressives Congress (APC) politics of development and inclusiveness in Lagos State. As an inspirational leader, with a track-record of performance, his candidacy was welcomed by Lagosians  as a continuation of ongoing development in Lagos State.
                    Mr. Sanwo-Olu, who was born on June 25, 1965 in Lagos State, is a reliable party man and astute politician, who is reputed for his people-centered ideology. His foray into public service started after decades of accomplishments in the private sector, especially the Nigerian banking sector, from where he retired as a General Manager.
                    This accomplished private sector expert, whose innovative mind quickly established as an exemplary public sector reformer, started his early education at Government Demonstration School, Surulere and Ijebu-Ife Grammar School, Ogun State.</p>
                    
                    
                    <p>

                    <div className='heading' id="education">Educational Background</div>
                        
                    For his higher education, he proceeded to the University of Lagos for a Bachelor’s degree in Surveying & Geo-Informatics and a Master of Business Administration (MBA) in Management from the same University. His Excellency, Mr. Sanwo-Olu is also an alumus prestigous of the prestigious Havard Kennedy School of Government, London Business School and the Lagos Business School.
                    In addition, he is a member of the Nigerian Institute of Directors (IOD), Chartered Institute of Personnel Management (CIPM), and Fellow of Nigeria Institute of Training and Development (NITAD).</p>

                    <p>

                    <div className='heading' id="governance"> Entry into Governance </div>

                    In 2003, his eventful career opened to yet another colorful chapter with his appointment, first as Special Adviser to the Deputy Governor on Corporate Matters; and later as Special Adviser to the Executive Governor on Corporate Matters in 2004.
                    His Excellency, Mr. Sanwo-Olu’s entry became a reference point for professionalism and excellence in the public service. At 39, he was appointed acting Commissioner for Economic Planning & Budget from 2004 to 2005, and became the substantive Commissioner for Commerce and Industry in 2007 following his exceptional performance.
                    
                    {<br></br>} {<br></br>}

                    His managerial imprint became noticeable at the Lagos State Ministry of Establishments, Training and Pensions in 2007 when he served as the Commissioner. During this period, Mr. Sanwo-Olu authored an executable Civil Service Framework designed around the Human Capital Performance Index, which puts Lagos State civil servants among the highest and regularly paid in the country.
                    A public officer with an impressive record of accomplishments, he was instrumental to the setting-up of Lagos State Pension Commission (LASPEC), a contributory pension scheme, even ahead of the Federal Government of Nigeria.</p>

                    <p>
                    
                    <div className='heading' id="highlights">Highlights & Contributions</div>

                    Some of his notable contributions include setting-up and serving as the pioneer Chairman the Lagos State Security Trust Fund Board, tracking and intelligent analysis of Internally Generated Revenues (IGR) by the various government agencies and parastatals, including the Board of Internal Revenue (BIR), for executive consideration and policy making; as well as preparation and publication of the Lagos State Economic Empowerment and Development Strategy (LASEEDS).
                    It is also to Sanwo-Olu’s credit that the Lagos Asset Management Limited (LAGBUS) was established to ease the public transportation problem by complementing the Bus Rapid Transit (BRT) system in Lagos State. He also worked on the Control & Command Centre in Alausa, which significantly improved the capacity of the security agencies to respond to distress calls in a swift and timely manner.
                    </p>
                    
                    <p>His Excellency, Mr. Sanwo-Olu was appointed the Chief Executive Officer (CEO) of the Lagos State Property Development Corporation (LSPDC) in 2016, and in just 2 years, the visionary administrator had returned the hitherto struggling organisation to the path of efficiency and profitability.
                    He also refocused the organisation to effectively tackle housing deficit in the state, which again validated his credentials as a resourceful leader and problem solver.
                    His valuable experience garnered from executive-level roles in the private and public sectors has not only distinguished him, but also made him a valuable resource to some notable organisations on whose boards he has served.</p>

                    
                    <p>It is unexpected that Babajide’s enterprising career in the private sector, defining roles in public service and selfless contributions to the society would not have attracted international recognition and accolades at home. But as a man attired in modesty, these awards and laurels are encouragements that keep him on the path of service to God and humanity.</p>

                    <p>
                    
                    <div className='heading' id="family">Sanwo-Olu's Family</div>

                    <div className="imp_img">

                         <div className="imageContainer">
                            <img src="https://res.cloudinary.com/dirmxkznt/image/upload/v1731756754/271509136_225364289670860_6275307121028768701_n_m6xtmi.jpg" /> 
                         </div>

                         <div className="imageContainer">
                            <img src="https://www.thexpressng.com/wp-content/uploads/2023/05/PIX-2708.jpg" /> 
                         </div>

                    </div>
                        
                    A devout Christian and family-focused man whose marriage to Dr. Ibijoke Sanwo-Olu is blessed with lovely children, Mr. Sanwo-Olu, in addition to his love for public speaking, is a member of numerous prestigious clubs, which include Ikoyi Club 1938, the Island Club, Yoruba Tennis Club and the Clear Essence Health Club.</p>

                    </div>

                </div>

            </Container>

        </div>

    </div>

  )

}
