import React, {useRef, useState, useEffect} from 'react'
import '../Government/mda.scss'
import Container from '../../components/container/container'
import { useNavigate } from 'react-router';
import Typewriter from 'typewriter-effect';
import mdaDB from '../Government/mda';
import LogoAgency from '../../assets/MDA/agency.svg'

import Fuse from 'fuse.js';
import { Globe, Internet, Message, Phone, PinSolid, Xmark } from 'iconoir-react';
import Mda_modal from '../Government/mda_modal';
import MdaResultsComponent from '../Government/mdaResultsComponent';
import { resourcesDB } from '../../api/data/resourcesDB';
import ResourceBase from './resourceBase';

export default function Resources() {

  const alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

 const [indexFilter, setIndexFilter] = useState('');
 //const [searchTerm, setSearchTerm] = useState('');

 const [isVisible, setIsVisible] = useState(false);
 const targetRef = useRef(null);

 let navigate = useNavigate();

 const [ query, setQuery ] = useState('');
 const [queryResults, setQueryResults] = useState(resourcesDB);


 const [isOpen, setIsOpen] = useState(false);
 const [modalData, setModalData] = useState({});

  const closeModal = () => {

      setIsOpen(false);

  }

  const openModal = (modal_data) => {

    setModalData(modal_data);
window.open(modal_data.url)

  }


 useEffect(() => {

  const fuseOptions = {

    keys: [
      "title",
      "theme"
    ]
  
  };

  const fuse = new Fuse(resourcesDB, fuseOptions);
  const results = fuse.search(query);
  const queriedRes =  query ? results.map(res => res.item) : resourcesDB;
  setQueryResults(queriedRes); 
  
 
 }, [query]);


 useEffect(() => {

if (indexFilter !== '') {

  const filterByIndex = resourcesDB.filter(e=>e.index === indexFilter);
  setQueryResults(filterByIndex);

} else {

  setQueryResults(resourcesDB);

}
  
 
 }, [indexFilter]);

 //UseRef in Intersection Observer;

 useEffect(() => {

   const observer = new IntersectionObserver(
     ([entry]) => {
       setIsVisible(entry.isIntersecting);
     },
     {
       root: null, // viewport
       rootMargin: '0px', // no margin
       threshold: 0, // 50% of target visible
     }
   );

   if (targetRef.current) {
     observer.observe(targetRef.current);
   }

   // Clean up the observer
   return () => {
     if (targetRef.current) {
       observer.unobserve(targetRef.current);
     }
   };

 }, []);
  
  return (
    
        <div className="government_style">

            {
                isOpen ? <Mda_modal data = {modalData} closeModal = { closeModal } /> : null
            }

            {
                isVisible ? (

                  <div className="abcAgain">

                    <div className="searchField fixedTop">

                      <input type="text" className="searchInput" value = {query} onChange={ e => setQuery(e.target.value) }/>

                      {
                        
                         query === '' 
                         ?
                         <div className="typeSide">

                            <Typewriter          
                            options={{
                                strings: ['Search for Lagos State Ministries...', 'Search for Lagos State Departments...', 'Search for Lagos State Agencies...' ],
                                autoStart: true,
                                loop: true,
                                delay : 40,
                                deleteSpeed : 10
                            }} />
            
                        </div> 

                        : null

                      }

                     </div>

                     <div className="mdas_sections fixedTop_2">

                        <div className="section all"> {queryResults.length} Results Found </div>
                       
                    </div>

                  </div>

                ) : null
            }

            <Container>

                <div className="topArea">

                    <div className="mdaHeader flex flex_col">

                        <div className="mdaTitle"> All Lagos State Resources & Archive </div>

                        <div className="mdaTitleSubs">Find contact information for Lagos government ministries, departments and agencies including websites, emails, phone numbers, addresses, and more. </div>

                    </div>

                </div>

                <div className="searchField">

                      <input type="text" className="searchInput" value = {query} onChange={ e => setQuery(e.target.value) }/>

                      {
                        
                         query === '' 
                         ?
                         <div className="typeSide">

                            <Typewriter          
                            options={{
                                strings: ['Search for Lagos State Ministries...', 'Search for Lagos State Departments...', 'Search for Lagos State Agencies...' ],
                                autoStart: true,
                                loop: true,
                                delay : 40,
                                deleteSpeed : 10
                            }} />
            
                        </div> 

                        : null

                      }

                </div>

                <div className="mdas_sections">

                      <div className="section all"> {queryResults.length} Results Found </div>

                </div>

                <div className="resultArea">


                      {
                         queryResults.length ? queryResults.map( (data, index) => {

                            return <ResourceBase data = {data} key = {index} openModal = {openModal} />

                         } ) : <h1>Oops! Sorry No results Found, Try Again!</h1>
                      }
                    

                </div>

            </Container>

        </div>

  )
}
