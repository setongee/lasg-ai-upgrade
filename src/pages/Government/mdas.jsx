import React, {useRef, useState, useEffect} from 'react'
import './mda.scss'
import Container from '../../components/container/container'
import { useNavigate, useParams } from 'react-router';
import Typewriter from 'typewriter-effect';
import { mdaDBv2 } from '../../api/data/mdaDBReal';
import LogoAgency from '../../assets/MDA/agency.svg'

import Fuse from 'fuse.js';
import MdaResultsComponent from './mdaResultsComponent';
import { Globe, Internet, Message, Phone, PinSolid, Xmark } from 'iconoir-react';
import Mda_modal from './mda_modal';
import { getAllMdas } from '../../api/read/mda.req';
import Loader from '../../components/loader/loader';

export default function Mdas() {

  const alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

 const [isVisible, setIsVisible] = useState(false);
 const targetRef = useRef(null);

 let navigate = useNavigate();
 let params = useParams().index;

 const [ query, setQuery ] = useState('');
 const [queryResults, setQueryResults] = useState([]);
 const [globalResult, setGlobalResult] = useState([]); 
 const [filterResults, setFilterResults] = useState([]);
 const [isLoading, setIsLoading] = useState(false);

 const [isOpen, setIsOpen] = useState(false);
 const [modalData, setModalData] = useState({});

  const closeModal = () => {

      setIsOpen(false);

  }

  const openModal = (modal_data) => {

    setModalData(modal_data);
    setIsOpen(true);

  }

  useEffect(() => {

    const fuseOptions = {

      keys: [
        "name",
        "type",
        "subdomain"
      ]
    
    };

    if (params !== "all"){

      const fuse = new Fuse(filterResults, fuseOptions);
      const results = fuse.search(query);
      const queriedRes =  query ? results.map(res => res.item) : filterResults;
      setQueryResults(queriedRes); 

    } 
    
    else{

      const fuse = new Fuse(globalResult, fuseOptions);
      const results = fuse.search(query);
      const queriedRes =  query ? results.map(res => res.item) : globalResult;
      setQueryResults(queriedRes); 

    }
    
  
  }, [query]);

 useEffect(() => {

setQueryResults([])

const active = document.querySelector('.index__active')

if (active === null) {

  const pin = document.querySelectorAll(`.${params}`)
  const p = Array.from(pin);
  p.forEach( e => e.classList.add('index__active'));
  
} else {

  active.classList.remove('index__active');
  const pin = document.querySelectorAll(`.${params}`)
  const p = Array.from(pin);
  p.forEach( e => e.classList.add('index__active'));

}


if (params !== 'all') {

  if (query !== "") setQuery("")

  if(globalResult.length){

    const filterByIndex = globalResult.filter( e => e.name.split("")[0].toUpperCase() === params.toUpperCase());
    setFilterResults(filterByIndex);
    setQueryResults(filterByIndex);
    
  } else {

    setIsLoading(true);

    getAllMdas().then((res => {

      const filter = res.filter( e => e.name.split("")[0].toUpperCase() === params.toUpperCase());
      setFilterResults(filter);
      setQueryResults(filter);
      setIsLoading(false);

    } ))

  }

} else {

  if (!globalResult.length){

    setIsLoading(true);
    getAllMdas().then( res => {

        setQueryResults(res);
        setGlobalResult(res);

        setIsLoading(false);

    } );
    
  } else{
    setQueryResults(globalResult);
  }

}
  
 }, [params]);

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

 useEffect(() => {

    if (isOpen){
      document.body.style.overflow = 'hidden'
    } else{
      document.body.style.overflow = 'visible'
    }
  
 }, [isOpen]);
  
  return (
    
        <div className="government_style">

            {
                isOpen ? <Mda_modal data = {modalData} closeModal = { closeModal } /> : null
            }

            <Container>

                <div className="topArea">

                    <div className="mdaHeader flex flex_col">

                        <div className="mdaTitle"> <span className='thick_700'> A-Z index </span> of Lagos Government Ministries, Departments & Agencies. </div>

                        <div className="mdaTitleSubs">Find contact information for Lagos government ministries, departments and agencies including websites, emails, phone numbers, addresses, and more. </div>

                    </div>

                </div>

                <div className="mid__area">

                    {/* index && search */}

                    <div className="index__search">

                        <div className="abcZone" ref = { targetRef } >

                            <div className="mdas_index all" onClick={ () => navigate(`/government/mdas/all`) }> - </div>

                            {
                              alpha.map( (e, index) => (

                                  <div className={`mdas_index ${e.toLowerCase()}`} key = {index} onClick={ () => navigate(`/government/mdas/${e.toLowerCase()}`) }> {e} </div>

                              ) )
                            }

                          </div>

                          <div className="searchField">

                              <input type="text" id = "yass" className="searchInput" value = {query} onChange={ e => setQuery(e.target.value) }/>

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

                      </div>

                      {/* results Section */}

                      <div className='results__section'>

                        <div className="mdas_sections">

                            <div className="section all"> {queryResults.length} Results Found </div>

                        </div>

                        <div className="resultArea">


                              {
                                queryResults.length ? queryResults.map( (data, index) => {

                                    return <MdaResultsComponent data = {data} key = {index} openModal = {openModal} />

                                } ) : !isLoading ? <h1>No results were found. Please try again with different search criteria</h1> : <Loader bg = "transparent" />
                              }
                            

                        </div>

                    </div>

                </div>

            </Container>

        </div>

  )
}
