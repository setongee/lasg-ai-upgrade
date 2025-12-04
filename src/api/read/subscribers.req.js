import axios from "axios"
import { env } from "./environment";

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

const base_url = `${env}/subscribers`

export const getAllSubscribers = async () => {

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