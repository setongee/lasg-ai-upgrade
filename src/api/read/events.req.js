import axios from "axios"
import { env } from "./environment";

const base_url = `${env}/events`

export const getAllEvents = async (topic, page) => {

    let pageInt = Number(page) - 1

    const response = await axios.get(`${base_url}/get/all/${topic}/${pageInt < 0 ? 0 : pageInt}`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const getSingleEvents = async (id) => {

    const response = await axios.get(`${base_url}/view/${id}`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const updateEvents = async (id, data) => {

    const response = await axios.put(`${base_url}/update/${id}`, data);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const registerEvent = async (id, data) => {

    const response = await axios.put(`${base_url}/rsvp/${id}`, data);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

