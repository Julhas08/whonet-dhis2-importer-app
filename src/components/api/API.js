import axios from 'axios';
import * as config  from '../../config/Config';
import {get} from './CRUD';

export const isDuplicate = async (input) => {
	let duplicateValue=[];
    let res = await get('api/programs.json?filter=id:eq:'+config.programId+'&fields=id,name,programStages[id,name,programStageDataElements[dataElement[id,name,code,attributeValues[value,attribute[id,name]]]]]&paging=false')
    	.then(function (response) {
			duplicateValue = response.data;
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		});

	return duplicateValue;
   
};