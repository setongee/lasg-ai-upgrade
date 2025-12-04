import { getAllSubscribers } from "./subscribers.req";
import { getAllMdas } from "./mda.req";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import axios from "axios"
import { env } from "./environment";

dayjs.extend(relativeTime);


export const reportServices = async () => {

    const base_url = `${env}/services`

    const response = await axios.get(`${base_url}/all`);
    
    if ( response.status === 200 ) {

        if(response.data.data.length){

            const sortData = response.data.data.sort( (a, b) => {

                return (a.updatedAt < b.updatedAt) ? -1 : ((a.updatedAt > b.updatedAt) ? 1 : 0);
    
            } )
    
            const howLong = dayjs().to(dayjs(sortData [ sortData.length - 1 ].updatedAt));
    
            return {
                data : sortData,
                lastUpdated : howLong,
                message : "Subscribers data has been fetched successfully!"
            }

        } else{
            return {
                data : [],
                lastUpdated : "0 days ago",
                message : "No subscribers yet!"
            }
        }

    } else{
        return "Something went wrong!";
    }

}

export const reportMDAs = async () => {

    const base_url = `${env}/mdas`

    const response = await axios.get(`${base_url}/all`);
    
    if ( response.status === 200 ) {

        if(response.data.length){

            const sortData = response.data.sort( (a, b) => {

                return (a.updatedAt < b.updatedAt) ? -1 : ((a.updatedAt > b.updatedAt) ? 1 : 0);
    
            } )
    
            const howLong = dayjs().to(dayjs(sortData [ sortData.length - 1 ].updatedAt));
    
            return {
                data : sortData,
                lastUpdated : howLong,
                message : "Subscribers data has been fetched successfully!"
            }

        } else{
            return {
                data : [],
                lastUpdated : "0 days ago",
                message : "No subscribers yet!"
            }
        }

    } else{
        return "Something went wrong!";
    }

}


export const reports__data = async () => {

    const data = {}
    
    await reportServices().then( e => data.services = e );
    await getAllSubscribers().then( e => data.subscribers = e )
    await reportMDAs().then( e => data.mda = e )

    return data;

}