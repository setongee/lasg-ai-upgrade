import React, {useEffect} from 'react'

import LogoMinistry from '../../assets/MDA/ministry.svg';
import LogoDepartment from '../../assets/MDA/department.svg';
import LogoAgency from '../../assets/MDA/agency.svg';
import { Globe, Internet, Phone, Message, Xmark, MailOut, MailOpen, Pin } from 'iconoir-react';
import { convertToTitleCase } from '../../middleware/middleware';

export default function Mda_modal( { data, closeModal } ) {

  return (

    <div className="openMdaModal">

        <div className="modal">

                <div className="closeModal" onClick={ () => closeModal() }> <Xmark/> </div>

                <div className="logoPart"> <img src={data.type === 'ministry' ? LogoMinistry : data.type === 'department' ? LogoDepartment : LogoAgency} alt="Lagos State Ministries, Departments & Agencies" /> </div>

                <div className="tag"> {data.type} </div>

                <div className="name_mda"> {convertToTitleCase(data.name)} </div>

                <div className="short"> {convertToTitleCase(data.description)} </div>

                <div className="address_icon"> <Globe/> Office Address </div>

                <div className="address"> {data.address} </div>

                <div className="contactArea">

                    <div className="icon target__web" onClick={ () => window.open( data.subdomain.split('.').length > 1 ? `https://${data.subdomain}` : `https://${data.subdomain}.lagosstate.gov.ng`)} title='Visit Website'> <Internet color='#fff'/> <p>Visit Website</p> </div>
                    <div className="icon target__web target__map" onClick={ () => window.open(`https://www.google.com/maps?q=${data.address}`) } title='Get Google Map Directions'> <Pin/> <p>Get Directions</p> </div>

                </div>

        </div>

    </div>

  )

}
