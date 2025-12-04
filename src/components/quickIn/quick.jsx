
import React,{useState, useEffect} from 'react'
import Container from '../container/container'
import quick from '../../assets/hd/lassra.png'
import carIn from '../../assets/hd/lagosride.png'
import feedback from '../../assets/hd/feedback.jpg'
import './quick.scss'
import { ArrowRight, NavArrowLeft, NavArrowRight } from 'iconoir-react'
import { SplitText } from '../../pages/home/SplitText'

export default function Quick() {

    const image__data = {

        image1 : quick,   
        image2 : carIn,  
        image3 : feedback,
        image4 : "https://cdn.prod.website-files.com/649e99ef8a9449db93f2c9ea/64e48289490a6936a9815b3c_blog%20%E2%80%93%E2%80%93%20what%20ilera%20eko.svg"     

    }

    const [image, setImage] = useState("");

    const changeIndexToCurrent = (index) => {

        setImage(`image${index}`);

    }

    const animateImages = () => {



    }

    useEffect(() => {
        
        setImage("image1");

    }, []);


    const scrollRight = (type) => {

        const rt = document.getElementById('search__cards');
        if(type === 'right'){
          rt.scrollLeft += 250
        }else{
          rt.scrollLeft -= 250
        }
    }

  return (

        <Container>

            <div className="quick">

            <img src={image__data[`${image}`]} alt="quick images" />

            <div className="quick__main">

                <div className="controls-x flex">

                    <div className="arrow__nav abs1" onClick={ () => scrollRight('left') }> 
                        <div className="abs"><NavArrowLeft/></div> 
                    </div>

                    <div className="arrow__nav abs1" onClick={ () => scrollRight('right') }> 
                        <div className="abs"><NavArrowRight/></div> 
                    </div>

                </div>

                <div className="quick__content">

                    <p> Empowering Lagosians : Streamlined Services at Your Fingertips</p>

                    <div className="subtitle">
                        Every family in Lagos is required to register with LASRRA and obtain a card for each family member.
                    </div>

                </div>

                <div className="search__cards__body flex" id='search__cards'>

                    <a target='_blank' href='https://registration.lagosresidents.gov.ng/register/' className="search__card top" onMouseOver={ () => changeIndexToCurrent(1) }>
                    <p> Get your LAG-ID card today.</p>
                    <div className="cta flex flex_align_center">Apply Now <div className="arrt"> <ArrowRight height={18} /></div> </div>
                    </a>

                    <a target='_blank' href='https://ileraeko.com/' className="search__card top" onMouseOver={ () => changeIndexToCurrent(4) }>
                    <p> Health plans as unique as you</p>
                    <div className="cta flex flex_align_center">Apply Now <div className="arrt"> <ArrowRight height={18} /></div> </div>
                    </a>

                    <a target='_blank' href='https://lagosride.com/' className="search__card" onMouseOver={ () => changeIndexToCurrent(2) } >
                    <p> Ride in style with Lagos Ride</p>
                    <div className="cta flex flex_align_center">Book a ride today <div className="arrt"> <ArrowRight height={18} /></div> </div>
                    </a>

                    <a target='_blank' href = 'https://citizensgate.lagosstate.gov.ng/' className="search__card" onMouseOver={ () => changeIndexToCurrent(3) }>
                    <p> Send feedback to Lagos State </p>
                    <div className="cta flex flex_align_center"> Get Started Here <div className="arrt"> <ArrowRight height={18} /></div> </div>
                    </a>

                </div>

            </div>

            </div>

        </Container>
    

  )
}
