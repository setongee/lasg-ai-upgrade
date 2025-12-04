import React,{useState} from 'react'
import { ArrowUpRight, NavArrowDown, NavArrowRight } from 'iconoir-react';
import { useNavigate } from 'react-router';
import vector1 from '../../assets/navBar/gov.svg'
import NestedView from './nestedView';
import Arrow from '../arrowEvents/arrow';

export default function NavElements(navigationRoutes) {

const navData = navigationRoutes.navigationRoutes;
let navigate = useNavigate();

const [showNest, setShowNest] = useState(false)

const addClass = (e) => {

    const parent = e.target;
    parent.classList.add('remain')
    console.log(parent);

}

const removeClass = (e) => {

    const parent = e.target;
    parent.classList.remove('remain')

}

return (

    <div className="navigationRoutes">

        {/* Type is nested */}
        <div className="nested_link">

            {/* Main Main 1 */}
            <div className="main_nav">

                {/* Parent Nested Link Name */}
                <div className="parentLink" 

                onMouseOver={ e => addClass(e) } 
                onMouseOut={ e => removeClass(e)} 
                
                >

                <div className="ParentName thick uppercase"> 

                    {navData.parentName} 
                    {navData.isNest ? <NavArrowDown color='#131414' className='navi' /> :  <Arrow color='#131414' /> } 

                </div>
                

                {/* ---------------------------------- Conditional Rendered Dropdown Component ---------------------------------- */}

                {/* Nested Links */}
                { navData.isNest ? <NestedView navData = {navData} isOpen={showNest} setOpen = {setShowNest} /> : null }

                </div>

            </div>

        </div>
        
    </div>

  )
}
