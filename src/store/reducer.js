import * as actionTypes from '../constants/actions.js';
const initialState = {
	counter: 0,
} 

const reducer = (state = initialState, action) =>{
	console.log("action.type: ", action.type);
	switch(action.type){

		case actionTypes.UPLOAD_PRE_ALERT:
			const newState = Object.assign({},state);
			newState.counter = state.counter+1; 
			return newState;
		default:
			return 0;	 			

	}
	return state;
}

export default reducer;