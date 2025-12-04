import React, {useState, useEffect} from 'react'

import { NavArrowDown, Xmark, ArrowUpRight } from 'iconoir-react'
import { useNavigate } from 'react-router'
import lasgLogo from '../../assets/navBar/lasg__logo.png'

export default function MobileView({closeModal}) {

  let navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);
  
  useEffect(() => {
    
    if(isClicked) {

      document.querySelector('.dropdownBottom').style.display = 'flex';

    } else{

      document.querySelector('.dropdownBottom').style.display = 'none';

    }
    

  }, [isClicked]);

  return (
    
    <div className="MobileBody">

        <div className="menuMobile">

          <div className="menuBarArea uppercase">
              <div className="title" onClick={ () => { navigate('/'); closeModal(); window.scrollTo(0,0) } } > <img src={lasgLogo} alt="Lagos State Official Digital Logo" /> </div>
              <div className="close" onClick={ () => closeModal(false) } > <Xmark width={45} height={45} strokeWidth={1}/> </div>
          </div>

          <div className="menu_sm dropdown"> 

            <div className='dropdownTop' onClick={ () => setIsClicked(!isClicked) } >  
            
                Government <div className="tagArr"><NavArrowDown/></div>
            
            </div>

            <div className="dropdownBottom">

                <p onClick={()=>{closeModal(); navigate('/government/elected_officials')}} > Executive Council </p>
                <p onClick={()=>{closeModal(); navigate('/government/mdas/all')}}> Explore Ministries </p>
                <a href="https://lagoshouseofassembly.gov.ng/home/our-team/" target='_Blank' onClick={()=>closeModal(false)} > Legislative Officers </a>
                <a href="https://lagosjudiciary.gov.ng/directories.html#directories" target='_Blank' onClick={()=>closeModal(false)} > Judiciary Officers </a>

            </div>

          </div>
          <div className="menu_sm" onClick={ () => {closeModal(); navigate('/services')} } >Services</div>    
          <div className="menu_sm" onClick={ () => {closeModal(); navigate('/news/all/1')} } >Newsroom </div>   
          <div className="menu_sm" onClick={ () => {closeModal(); navigate('/events/all/1')} } >Events </div>    
          <div className="menu_sm" onClick={ () => {closeModal(); navigate('/connect')} } > Connect </div>   

        </div>

    </div>

  )
}
