import axios from 'axios';
import * as config  from '../../config/Config';
import { get } from './CRUD';
import { request } from './Request';

/**
* Check the selected org unit is assigned under this program or not
* If does not assign then to stop the import
*/
export const checkOrgUnitInProgram = async (orgUnitId) => {
    return await get(request('api/programs/'+config.programId+'.json?', {
        order: 'created:asc',
        fields: 'id,name,organisationUnits',
        filters: `organisationUnits.id:eq:${orgUnitId}`,
        //options: [`trackedEntityInstance=${entity}`],
    }))
	.then(function (responseObj) {
		
		if(Object.entries(responseObj.data).length !== 0) {
			console.log(responseObj);
			return responseObj.data.organisationUnits.filter(function(orgUnit) {
            	return orgUnit.id === orgUnitId;  
        	});	
		}
				
	})
	.catch(function (error) {
		console.log(error.response.data);
	});   
};
/**
* Gets duplicate record
* @param {String} input - hashed patient id
* @returns {Object} duplicate values
*/
export const isDuplicate = async (input, orgUnitId) => {



	let duplicateValue=[];
	let matchResult;
    return await get(request('api/trackedEntityInstances.json?program='+config.programId+'&ou='+orgUnitId, {
            order: 'created:asc',
            fields: 'attributes[attribute,value]',
            //filters: `${duplicateValue}:eq:${input}`,
            //options: [`trackedEntityInstance=${entity}`],
        }))
    	.then(function (response) {
    		
    		if(response.data.trackedEntityInstances.length !== 0){
	    		if(typeof response.data.trackedEntityInstances !== 'undefined'){

	    			duplicateValue = response.data.trackedEntityInstances[0].attributes;
	    			console.log("duplicateValue: ", duplicateValue);
	    			

					matchResult = duplicateValue.filter(function(data){
						return data.value === input;
					});
					console.log("matchResult: ", matchResult);
					return matchResult;
	    		}
    		}
			
		})
		.catch(function (error) {
			// handle error
			console.log(error.response.data);
		});
   
};

export const createTrackedEntity = async (trackedEntityJson) => {
    return await axios(config.baseUrl+'api/trackedEntityInstances', {
        method: 'POST',
        headers: config.fetchOptions.headers,
        data: trackedEntityJson,
    })
   
};

export const getPrograms = async () => {
    return await get('api/programs.json?filter=id:eq:'+config.programId+'&fields=id,name,programStages[id,name,programStageDataElements[dataElement[id,name,code,attributeValues[value,attribute[id,name]]]]]&paging=false')
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});
};

export const getAttributes = async () => {
    return await get('api/trackedEntityAttributes.json?fields=id,name,code,attributeValues[value,attribute]')
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});
};

export const getOptionsInOptionGroups = async () => {
    return await get('api/optionGroups/'+config.optionGroupsId+'.json?fields=id,name,code,options[:id,name,code,attributeValues]')
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});
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
* @retunrs single attribute detail
*/
export const getAttributeDetails = async (attributeId) => {
    return await get('api/trackedEntityAttributes/'+attributeId)
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});
};
/**
* Category Options
* @retunrs single option detail
*/
export const getOptionDetails = async (optionId) => {
    return await get('api/categoryOptions/'+optionId)
    	.then(function (response) {    		
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});
};
/**
* Meta attribute-elements-options update
* updates of attributes values
*/
export const metaDataUpdate = async (api, jsonPayload) => {
    return await axios(config.baseUrl+api, {
        method: 'PUT',
        headers: config.fetchOptions.headers,
        data: jsonPayload,
    })
   
};
