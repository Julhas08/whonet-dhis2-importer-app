import axios from 'axios';
import * as config  from '../../config/Config';
/**
 * Operation type: get
 * @param {String} endpoint
 * @returns Server response.
 */
export const get = async (endpoint) =>{
	return await (await axios(config.baseUrl + endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: config.fetchOptions.headers
    	}    
	))
}


/**
 * Operation type: post
 * @param {String} endpoint
 * @returns Server response.
 */
export const post = async (endpoint, jsonPayload) =>{
	return await (await axios(config.baseUrl + endpoint, {
		method: 'POST',
		headers: config.fetchOptions.headers,
        body: JSON.stringify(jsonPayload),
    	}    
	))
}

    