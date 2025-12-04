import axios from "axios"
import { env } from "./environment";

const base_url = `${env}/services`

export const getAllServices = async () => {

    const data = await axios.get(`${base_url}/all`);
    
    if(data.status === 200) {
        return data.data;
    } else{
        return [];
    }

}

export const getSingleService = async (id) => {

    const data = await axios.get(`${base_url}/get/single/${id}`);
    
    if(data.status === 200) {
        return data.data;
    } else{
        return [];
    }

}

export const getAllServicesCategory = async (id) => {

    const data = await axios.get(`${base_url}/get/category/${id}`);
    
    if(data.status === 200) {
        return data.data;
    } else{
        return [];
    }

}

export const updateSingleService = async (id, data) => {

    const response = await axios.put(`${base_url}/update/${id}`, data);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const deleteSingleService = async (id) => {

    const response = await axios.delete(`${base_url}/delete/${id}`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}