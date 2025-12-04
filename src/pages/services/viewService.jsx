import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router'
import Container from '../../components/container/container';
import { ArrowLeft } from 'iconoir-react';
import './viewService.scss';
import Fuse from 'fuse.js';

import ServiceSearchResults from './serviceSearchResults';
import ViewServiceModal from './viewServiceModal';
import { getAllServicesCategory } from '../../api/read/services.req';
import { getSingleCategory } from '../../api/read/category.req';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../components/loader/loader';

import notfound from '../../assets/404/404.png'

// End of Icons

export default function ViewService() {

    let params = useParams();
    let navigate = useNavigate(); 

    const [data, setData] = useState([]);
    const [ query, setQuery ] = useState('');
    const [queryResults, setQueryResults] = useState([]);
    const [categoryDetails, setCategoryDetails] = useState([]);

    // Modal States
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsMOdalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
   useEffect(() => {

    document.body.style.overflow = "visible";

    setIsLoading(true);

    getAllServicesCategory(params.theme).then(e => {
      setIsLoading(false)
      setData(e.data);
    });
    getSingleCategory(params.theme).then( e => setCategoryDetails(e.data[0]))

   }, []); 


  useEffect(() => {

    document.body.style.overflow = "visible";

    const fuseOptions = {

    includeScore : true,
  
      keys: [
        "short",
        "name",
      ]
    
    };
  
    const fuse = new Fuse(data, fuseOptions);
    const results = fuse.search(query);
    const queriedRes =  query ? results.map(res => res.item) : data;
    setQueryResults(queriedRes);
   
   }, [query]);

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

const handleChange = (e) => {

  setQuery(e.target.value);

}

if (!categoryDetails) return <div className="found"> <div className="photo"><img src={notfound} alt="" /></div> <h1>Oops! Page not found</h1></div>

  return (

    <div className="viewService">

        {
          isModalOpen ? <div className="viewMax" onClick={handleCloseBar} > <ViewServiceModal data = {modalData} close = {closeModal} category = {categoryDetails.name} /> </div> : null
        }

        <Container>

            <div className="viewArea">

                <div className="navigationPin">

                    <div className="goBack" onClick={()=> navigate(-1) } ><ArrowLeft/> </div>

                    <div className="serviceTitle"> {categoryDetails.name} </div>

                </div>

                {/* Search Area Side With Search Input */}

                <div className="searchField">

                      <input type="text" className="searchInput" value = {query} onChange={ e => handleChange(e) } placeholder='Start searching here...' />

                </div>

                {/* searched query results */}

                <div className="mdas_sections">

                    {
                      !isLoading ? <div className="section all"> { query !=='' ? queryResults.length : data.length} Results Found </div> : null
                    }

                </div>

                {
                  !isLoading ?
                  <div className="resultArea">

                      {
                         queryResults.length ? queryResults.map( (res, index) => (

                            <ServiceSearchResults data = {res} key = {res._id} openModal = {openModal} logo = {categoryDetails.icon} />


                        ) ) : query !== '' ? <h1>Oops! Sorry No results Found, Try Again!</h1> : data?.map((e, index) => <ServiceSearchResults data = {e} key = {e._id} openModal = {openModal} logo = {categoryDetails.icon}  /> )

                      }                    

                </div> : <div className="fullPortion"><Loader/></div>
                }


            </div>

        </Container>

    </div>

  )
}
