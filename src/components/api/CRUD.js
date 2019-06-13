import axios from 'axios';
import * as config  from '../../config/Config';
/**
 * @param {String} endpoint
 * @returns Server response.
 */
export const get = async (endpoint) =>{
	return await (await axios.get(config.baseUrl + endpoint, config.fetchOptions))
}

    