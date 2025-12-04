import axios from "axios"
import { env } from "./environment";
import { sortArray, sortArrayByNumber } from "../../middleware/middleware";

const base_url = `${env}/executives`


export const getAllMembers = async () => {

    const response = await axios.get(`${base_url}/get/all`);
    
    if(response.status === 200) {

        const newArray = sortArrayByNumber(response.data.data, "phone")
        .then( e => e );

        return newArray;

    } else{

        return [];

    }

}

export const getSingleMember = async (id) => {

    const response = await axios.get(`${base_url}/view/${id}`);
    
    if(response.status === 200) {
        return response.data;
    } else{
        return [];
    }

}

export const getSingleMemberByName = async (name) => {

    const newName = decodeURI(name);

    const response = await axios.get(`${base_url}/get/${newName}`);
    
    if(response.status === 200) {

        if(response.data?.data?.length){
            return response.data.data[0];
        }
        
    } else{
        return [];
    }

}

