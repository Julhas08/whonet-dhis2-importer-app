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
  			return responseObj.data.organisationUnits.filter(function(orgUnit) {
          return orgUnit.id === orgUnitId;  
      	});	
  		}  				
  	})
  	.catch(function (error) {
  		console.log(error.response);
  	});   
};
/**
* Gets duplicate record
* @param {String} input - hashed patient id
* @returns {Object} duplicate values
*/
export const isDuplicate = (input, orgUnitId, attributeId) => {

	let duplicateValue=[];
	let matchResult;
    if(typeof attributeId !== 'undefined' && typeof input !== 'undefined'){
      return get(request('api/trackedEntityInstances.json?program='+config.programId+'&ou='+orgUnitId, {
          order: 'created:asc',
          fields: 'trackedEntityInstance,attributes[attribute,value]',
          filters: `${attributeId}:eq:${input}`,
      }))
      .then(function (response) {
          if(typeof response.data.trackedEntityInstances !== 'undefined'){
              duplicateValue = response.data.trackedEntityInstances[0].attributes;     
              let teiId = response.data.trackedEntityInstances[0].trackedEntityInstance;
              matchResult = duplicateValue.filter(function(data){
                  return data.value === input;
              });
              return {"teiId": teiId, "result": matchResult.length};
          }           
      })
      .catch(function (error) {
        if(typeof error.response !== 'undefined'){
          console.log(error.response);
        }
      });
    }  
};
export const getMe = async () => {
    // return await get('api/me.json?fields=id,name,organisationUnits[:id,name,level,children[id,name,level,children[id,name,level,children[id,name,level]]]]&order:name:asc')
    return await get('api/me.json?fields=organisationUnits[id,name,level,parent,children::isNotEmpty]');
};

export const createTrackedEntity = async (trackedEntityJson) => {
    return axios(config.baseUrl+'api/trackedEntityInstances', {
        method: 'POST',
        headers: config.fetchOptions.headers,
        data: trackedEntityJson,
    }) 
};

export const getPrograms = async () => {	
    //,attributeValues[value,attribute[id,name]]
    return await get('api/programs.json?filter=id:eq:'+config.programId+'&fields=id,name,programStages[id,name,programStageDataElements[dataElement[id,name,code]]]&paging=false')
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

/**
* Get organisation unit detail
* @returns {string} org unit detail
*/
export const getOrgUnitDetail = async (orgUnitId) => {
  return await get('api/organisationUnits/'+orgUnitId+'.json?fields=id,name,shortName,level,code');
   
};

/**
 * Generates AMR Id consisting of OU code and a random integer.
 * @param {string} orgUnitId - Organisation unit ID.
 * @returns {string} AMR Id.
 */
export const generateAmrId = async (orgUnitId, orgUnitCode, amrDataElement) => {
    const newId = () =>
    orgUnitCode + (Math.floor(Math.random() * 90000) + 10000)
    let amrId = newId();
    return get(
      request('api/events.json?', {
        fields: 'event',
        filters: `${config.amrIdDataElement}:eq:${amrId}`,
        options: [`orgUnit=${orgUnitId}`],
      })
    ).then( response =>{
      if (response.data.events.length) {
        amrId = response.data.events;
        return amrId;
      } else {
        return amrId;
      }
    });
}

/**
* Get data store
* @returns {string} org unit detail
*/
export const getDataStoreNameSpace = async (key) => {
  return await get('api/dataStore/whonet/'+key);
   
};

export const createDateStoreNameSpace = async (api, jsonPayload) => {
    return await axios(config.baseUrl+api, {
        method: 'POST',
        headers: config.fetchOptions.headers,
        data: jsonPayload,
    })   
};