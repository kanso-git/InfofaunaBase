import * as types from '../actions/Types';

const initialState = {
    data: null,
    error: null,
    ongoingRequest: false,
    opreationType:null,
};

const personReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.PREPARE_FORM_FOR_ADD:
            return {...initialState}
        case types.INITIATE_FETCH_PERSON:
            return {...state, ongoingRequest: true, opreationType:null};
        case types.ERROR_FECTHING_PERSON:
        case types.ERROR_ADD_PERSON:
        case types.ERROR_UPDATE_PERSON:
            return {...state, error: action.payload, ongoingRequest: false};
        case types.FETCH_PERSON:
            return {
                ...state,
                data: action.payload,
                error: null,
                ongoingRequest: false,
                opreationType:types.FETCH_OPREATION_TYPE
            };
        case types.ADD_PERSON:
        case types.UPDATE_PERSON:
        case types.DELETE_PERSON:
            return {...state, ongoingRequest: false,  error: null,opreationType:action.payload};
        default:
            return state;
    }
};

export default personReducer;
