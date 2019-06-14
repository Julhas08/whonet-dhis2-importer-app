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

export const getPrograms = async () => {
    let response = await get('api/programs.json?filter=id:eq:'+config.programId+'&fields=id,name,programStages[id,name,programStageDataElements[dataElement[id,name,code,attributeValues[value,attribute[id,name]]]]]&paging=false')
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});

	return response;
};

export const getAttributes = async () => {
    let response = await get('api/trackedEntityAttributes.json?fields=id,name,code,attributeValues[value,attribute]')
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});

	return response;
};

export const getOptions = async () => {
    let response = await get('api/optionGroups/'+config.optionGroupsId+'.json?fields=id,name,code,options[:id,name,code,attributeValues]')
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});

	return response;
};

/**
* @retunrs single element detail
*/
export const getElementDetails = async (elementId) => {
    return await get('api/dataElements/'+elementId)
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});
};
/**
* Meta attribute-elements update
* updates of attributes values
*/
export const metaElementUpdate = async (api, jsonPayload) => {
    return await axios(config.baseUrl+api, {
        method: 'PUT',
        headers: config.fetchOptions.headers,
        data: jsonPayload,
    })
   
};