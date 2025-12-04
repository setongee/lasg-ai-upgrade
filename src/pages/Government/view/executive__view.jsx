import React, {useEffect} from 'react'

import '../officials.scss'

import { useParams } from 'react-router'
import Container from '../../../components/container/container';
import { DownloadCircle } from 'iconoir-react/solid';
import { Send } from 'iconoir-react';

import { useQuery } from '@tanstack/react-query'
import { getSingleMember, getSingleMemberByName } from '../../../api/read/executives.req';
import Loader from '../../../components/loader/loader';

export default function Executive__view() {

let params = useParams();

const {isLoading, data} = useQuery({

    queryKey: ["exec"],
    queryFn: () => getSingleMemberByName(params.name)

})

useEffect(() => {
    
    if(data) {
        
        const tc = document.getElementById("text");
        tc.innerHTML = data?.content
    }

}, [data]);

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

            <p onClick={ () => window.location.href = '/government/elected_officials/cos/view'  } >Chief of Staff</p>

            <p onClick={ () => window.location.href = '/government/elected_officials/dcos/view'  } >Deputy Chief of Staff</p>

        </div>

        <div className="officials_body">

            <Container>
                
                <div className="viewport">

                    <div className="official_details">

                        <div className="official_name">{data?.fullname} </div>
                        <div className="post"> -{data?.position} - </div>

                    </div>

                    <div className="official_photo">
                        <img src={data?.photo} alt = {`${data?.fullname} - ${data?.position} of Lagos State official photo`} />
                    </div>

                    <div className="downloadPortrait" onClick={ () => window.open(data?.photo) } > <DownloadCircle/> Download Official Portrait </div>


                    <div className="official_bio customBio" id='text'>

                        

                    </div>


                </div>

            </Container>

        </div>

    </div>

  )

}

