import React from 'react'
import { ArrowUpRight } from 'iconoir-react'
import Container from '../container/container'


export default function Top__header() {

  return (

    <div className="seth_Link">

        <Container>

            {/* quick_links */}
            <div className="quick_links"> 

                <div className="fixUp uppercase flex">
                    
                    <p> Toll-free emergency lines (LASEMA)</p>

                    <div className="numbers flex">

                        <a href="tel:08056250710"> 767 </a>
                        <p>|</p>
                        <a href="tel:08033482380"> 112 </a>

                    </div>

                </div>
            
            </div>

        </Container>

    </div>

  )

}
