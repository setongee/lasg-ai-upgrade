import axios from "axios"
import { env } from "./environment";

const base_url = `${env}/mdas`


const getAllMdas = async () => {

    const response = await axios.get(`${base_url}/all`);
    
    if ( response.status === 200 ) {

        let sortData = response.data.data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'en', { sensitivity: 'accent' }));

        return sortData;

     }

     else {
         return [];
     }

}

const getSingleMda = async (id) => {

    const response = await axios.get(`${base_url}/${id}`);

     if ( response.status === 200 ) {

        return response.data;

    } 
    
    else{

        return [];

    }

}


export {

    getSingleMda,
    getAllMdas
    
}