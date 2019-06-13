import axios from 'axios';
import * as config  from '../../config/Config';
import { get, post } from './CRUD';

/**
* Gets duplicate record
* @param {String} input - hashed patient id
* @returns {Object} duplicate values
*/
export const isDuplicate = async (input, orgUnitId) => {
	let duplicateValue=[];
	let matchResult;
    let res = await get('api/trackedEntityInstances.json?program='+config.programId+'&ou='+orgUnitId+'&fields=attributes[attribute, value]')
    	.then(function (response) {
    		if(response.data.trackedEntityInstances.length != 0){
	    		if(typeof response.data.trackedEntityInstances !== 'undefined'){
	    			duplicateValue = response.data.trackedEntityInstances[0].attributes;
					matchResult = duplicateValue.filter(function(data){
						return data.value === input;
					});
					return matchResult;
	    		}
    		}
			
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		});

	 return res;
   
};

export const createTrackedEntity = async (trackedEntityJson) => {
        return await axios(config.baseUrl+'api/trackedEntityInstances', {
            method: 'POST',
            headers: config.fetchOptions.headers,
            data: trackedEntityJson,
        })

   
};

export const createEvents = async (eventDeJson) => {
    return await axios(config.baseUrl+'api/events', {
            method: 'POST',
            headers: config.fetchOptions.headers,
            data: eventDeJson,
        })

        /*post('api/events', eventDeJson)
    	.then(function (response) {
			return response;
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		});*/

   
};