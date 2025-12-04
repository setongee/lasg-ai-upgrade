import axios from "axios"
import { env } from "./environment";

const base_url = `${env}/news`

export const addNews = async (data) => {

    const response = await axios.post(`${base_url}/add`, data);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const getAllNews = async (page, topic) => {

    const response = await axios.get(`${base_url}/get/all/${topic}/${page}`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const getSingleNews = async (id) => {

    const response = await axios.get(`${base_url}/view/${id}`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const updateNews = async (id, data) => {

    const response = await axios.put(`${base_url}/update/${id}`, data);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const deleteNews = async (id) => {

    const response = await axios.delete(`${base_url}/delete/${id}`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

