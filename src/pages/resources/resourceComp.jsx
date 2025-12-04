import React from 'react'

import LogoMinistry from '../../assets/MDA/ministry.svg';
import LogoDepartment from '../../assets/MDA/department.svg';
import LogoAgency from '../../assets/MDA/agency.svg';
import { Globe, Internet, Phone, Message, Xmark, MailOut, MailOpen } from 'iconoir-react';

export default function ResourceComp( { data, closeModal } ) {

  return (

    <div className="openMdaModal">

        <div className="modal">

                <div className="closeModal" onClick={ () => closeModal() }> <Xmark/> </div>

                <div className="logoPart"> <img src={data.type === 'ministry' ? LogoMinistry : data.type === 'department' ? LogoDepartment : LogoAgency} alt="Lagos State Ministries, Departments & Agencies" /> </div>

                <div className="tag"> {data.type} </div>

                <div className="name_mda"> {data.name} </div>

                <div className="short"> {data.short} </div>

                <div className="address_icon"> <Globe/> Office Address </div>

                <div className="address"> {data.address} </div>

                <div className="getDirections">Get Directions</div>

                <div className="contactArea">

                    <div className="icon" onClick={ () => window.open(data.website) } title='Visit Website'> <Internet/> </div>
                    <div className="icon" onClick={() => window.open("tel:5551234567")} title='Make a phone call or send SMS' > <Phone/> </div>
                    <div className="icon" title='Send an Email'> <MailOpen /> </div>

                </div>

        </div>

    </div>

  )

}
