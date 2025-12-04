import React,{useState, useEffect} from 'react'
import './servicesPAGE.scss'
import Container from '../../components/container/container'
import Typewriter from 'typewriter-effect';
import { ArrowUpRight } from 'iconoir-react';
import Services from '../../components/services/services';
import { servicesDB } from '../../api/data/servicesDB';
import Fuse from 'fuse.js';
import ServiceSearchResults from './serviceSearchResults';
import ViewServiceModal from './viewServiceModal';
import Transitions from '../../utils/transitions';

export default function ServicesPage() {

  const [ query, setQuery ] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0)

  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsMOdalOpen] = useState(false);


  useEffect(() => {

    const fuseOptions = {

      includeScore : true,
  
      keys: [
        "sub_service",
        "theme",
        "short"
      ]
    
    };
  
    const fuse = new Fuse(servicesDB, fuseOptions);
    const results = fuse.search(query);
    const queriedRes =  results.map(res => res.item);
    setQueryResults(queriedRes);
   
   }, [query]);


// useEffect(() => {
    
//     const mapple = queryResults.map( e => e.services.length);
//     const rest = mapple.reduce( (a, b) => {

//         return a + b;

//     }, 0 );

//     setTotalResults(rest);

// }, [queryResults]);



const openModal = (data) => {

    setModalData(data);
    setIsMOdalOpen(true);
    document.body.style.overflow = "hidden";

 }

 const closeModal = (data) => {

  setModalData({});
  setIsMOdalOpen(false);
  document.body.style.overflow = "visible";

}


 const handleCloseBar = (e) => {

    if ( e.target.classList[0] === 'view_service_modal' ) {
  
      closeModal();
  
    }
  
  }

  return (

      <div className="servicesPage">

        {
          isModalOpen ? <div className="viewMax" onClick={handleCloseBar} > <ViewServiceModal data = {modalData} close = {closeModal}  /> </div> : null
        }

        <Container>

            <div className="servicesBody">

                <div className="servicesTop">

                    <div className="pageHeader flex flex_col">

                        <div className="pageTitle"> Explore Lagos State Government : Browse all Services in One Place </div>
                        <div className="pageTitleSubs"> Empowering Citizens of Lagos State to Engage with their Government. </div>

                    </div>

                </div>

                {/* Search Area Side With Search Input */}

                {/* <div className="searchField">

                      <input type="text" className="searchInput" value = {query} onChange={ e => setQuery(e.target.value) }/>

                      {
                        
                         query === '' 
                         ?
                         <div className="typeSide">

                            <Typewriter          
                            options={{
                                strings: ['Pay for LASAA fees...', 'Register for a farm...', 'Ground Rentals...', 'Drivers Lisense Application...', 'Apply for Lagos State education scholarship...'],
                                autoStart: true,
                                loop: true,
                                delay : 40,
                                deleteSpeed : 10
                            }} />
            
                        </div> 

                        : null

                      }

                </div> */}

                {/* searched query results */}

                {
                    query !== '' ? (

                        <div className="mdas_sections">

                            <div className="section all"> {queryResults.length} Results Found </div>

                        </div>

                    ) : null
                }

                <div className="resultArea">


                      {
                         queryResults.length && query !== '' ? queryResults.map( (data, index) => (

                            <ServiceSearchResults data = {data} key = {index} openModal = {openModal} icon = {data.theme.trim()} />

                        ) ) : query !== '' ? <h1>Oops! Sorry No results Found, Try Again!</h1> : null

                      }
                    

                </div>

            </div>
            
        </Container>

        {/* services Component */}

        {
            query === '' ? (

                <div className="servicesSide">

                    <Services bgColor = "#fdfdfd" location = 'services' data_limit={1000} />

                </div>

            ) : null
        }

      </div>
    
  )
}
