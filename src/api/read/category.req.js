import axios from "axios"
import { env } from "./environment";

const base_url = `${env}/category`

export const getAllCategory = async () => {

    const response = await axios.get(`${base_url}/all`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const getSingleCategory = async (name) => {

    const response = await axios.get(`${base_url}/name/${name}`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

