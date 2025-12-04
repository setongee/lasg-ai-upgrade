import React, {useState, useEffect} from 'react'
import './search.scss'
import Container from '../container/container'
import { MicrophoneSpeakingSolid, Search, Xmark } from 'iconoir-react'
import {motion} from 'framer-motion'
import Fuse from 'fuse.js'
import SearchResultsQuery from './searchResultsQuery'
import ViewSearchModal from './searchModal'
import { useLocation } from 'react-router'
import { getAllServices } from '../../api/read/services.req'
import { useQuery } from '@tanstack/react-query'
import './searchBorderAnimation.scss'

import loader from '../../assets/loaders/loader.svg'
import Loader from '../loader/loader'
import Dictaphone from './Speech'

export default function SearchQuery({query, closeModal}) {

  const location = useLocation().pathname;

  const [search, setSearch] = useState(query === "" ? "" : query);

  const [queryResults, setQueryResults] = useState([]);
  const [relations, setRelations] = useState([]);

  const [searchView, setSearchView] = useState({});
  const [showInfo, setShowInfo] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
   
    document.body.style.overflow = 'hidden';
   
  }, []);

  const handleClose = () => {

    setShowInfo(false);

  }

  const viewSearch = data => {

    setSearchView(data);
    setShowInfo(true);
    document.body.style.overflow = 'hidden'

  }

  const handleCloseBar = (e) => {

    if ( e.target.classList[0] === 'view_service_modal' ) {

      handleClose();

    }

  }

  const { isLoading, error, data } = useQuery({

    queryKey: ["services"],
    queryFn: () => getAllServices(),

  })

  useEffect(() => {

      let newService = data?.data;
      
      if (newService?.length) updateAll(newService);

    
  }, [data]);

  const updateAll = (dat) => {

      const newp = dat.map( (res, index) => {

          const response = res.keywordsGroup;
          const arr = Object.entries(response).map(res => res[1]);
          const newArray = [].concat(...arr);

          res.keywordsTrim = newArray;

          return res;

      })

      setServiceData(newp);

  }

  useEffect(() => {

    let score = 0.1;

    const fuseOptions = {

      includeScore : true,
      shouldSort : true,
      threshold : 0.5,
      ignoreLocation : true,
      ignoreFieldNorm : true,
      useExtendedSearch : true,
      // keys : ['name', 'keywords.key', 'categories', 'url']
      // keys : ['name', 'keywordsTrim.key']
      
      keys: [
        {
          name: 'name',
          weight: 1
        },
        {
          name: 'keywordsTrim.key',
          weight: 0.1
        },
        {
          name: 'customKeywords.key',
          weight: 0.1
        },
        {
          name: 'categories',
          weight: 0.8
        },
        
      ]
    
    };

    let newSearch = search;

    const newFilterIndex = search.toLowerCase().split(' ');
    if (newFilterIndex.length > 1 && newFilterIndex.includes('lagos')){

      let nS = search.replace('lagos', '')

      newSearch = `'${nS}`;

    }
  
    const fuse = new Fuse(serviceData || [], fuseOptions);
    const results = fuse.search(newSearch);
    const queriedRes = results.filter( item => item.score <= score ).map(res => res.item);
    const otherRelated = results.filter( item => item.score > score && item.score < 0.4 ).map(res => res.item);

    setQueryResults(queriedRes);
    setRelations(otherRelated)
    console.log(results)
   
   }, [search, serviceData]);


   const textToSpeech = (text) => {

    const finalStatement = `Searching for services on ${text}`

    let utterance = new SpeechSynthesisUtterance(text !== '' ? finalStatement : '');

    utterance.voice = window.speechSynthesis.getVoices()[159];
  
    // Speak the utterance
    window.speechSynthesis.speak(utterance);

   }

   const checkIfMicStopped = (que) => {
    
      textToSpeech(que);

   }

   
   const transcribeSearch = (transript) => {

      if (transript !== ""){
          
        setSearch(transript);

      }

   }


  return (

    <motion.div className="search__component" initial = {{x : 1000}} animate = {{x : 0}} transition={{ type: "tween", duration : .4, ease : "easeInOut" }} >

        {
          showInfo 
          ?
          <div className="showInfo" onClick={handleCloseBar} > 

            <ViewSearchModal data = {searchView} close = {handleClose} />
        
          </div> : null
        }

        <Container>

          <div className="close__search__modal" onClick={closeModal} > <Xmark strokeWidth={1} /> </div>

          <div className="search__title">

            <div className="sub uppercase flex">

              Lagos state 
              <div className="line"></div> 
              <span className='flex flex_align_center' > <div className="searchIcon"><Search/> </div> global search</span>

            </div>

            <motion.div className="top" initial = { { opacity : 0, y : 100 } } animate = { { opacity : 1, y : 0 } } transition={ { delay : .4, duration : .4 } } ><span>Hey there,</span> get curated information from all news, services & topics </motion.div>

          </div>
    

          <div className="results__calculations"> - { queryResults?.length } Results found - </div>

          <div className="search__query__results">

              {
                isLoading ? <div className="load"><Loader/></div> : 
                queryResults?.length 
                ? 
                queryResults.map( (response, index) => (

                  <SearchResultsQuery key = {index} data = {response} i = {index} search = {viewSearch} />

                )) : search === "" ? <p className='feedback'> Start searching and get results by typing or speaking...</p> : <p className='feedback'> No results found for <span style={{color : "green"}}>'{search}'</span> at the moment, try a different search term </p>
              }

              {
                
                relations.length ?

                  <div className="relations">

                    <div className="relations__title"> - Other Related Services - {relations?.length} Results </div>

                    <div className="search__query__results">

                        {
                          relations.length ?
                          relations.map( (response, index) => (

                            <SearchResultsQuery key = {index} data = {response} i = {index} search = {viewSearch} />
          
                          )) : null
                        }

                    </div>

                  </div> : null

              }

          </div>

          <div className="search__field flex">

              <div className="useCard">
              
                <input type="text" placeholder='Search for Anything here...' value={search} onChange={ e => setSearch(e.target.value)} />

                {
                  search !== "" ? <div className="closeInput" onClick={ () => setSearch("") } > <Xmark color='#fff'/> </div> :  null
                }
                
              </div>

              <Dictaphone setSpeechQuery = {transcribeSearch} checkMic = {checkIfMicStopped} />
            
          </div>

          

        </Container>

    </motion.div>
    
  )
  
}
