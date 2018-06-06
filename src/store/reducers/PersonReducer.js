import * as types from '../actions/Types';

const initialState = {
    data: null,
    error: null,
    ongoingRequest: false
};

const personReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.INITIATE_FETCH_PERSON:
            return {...state, ongoingRequest: true};
        case types.ERROR_FECTHING_PERSON:
        case types.ERROR_ADD_PERSON:
        case types.ERROR_UPDATE_PERSON:
            return {...state, error: action.payload, ongoingRequest: false};
        case types.FETCH_PERSON:
            return {
                ...state,
                data: action.payload,
                error: null,
                ongoingRequest: false
            };
        case types.ADD_PERSON:
        case types.UPDATE_PERSON:
            return {...state, ongoingRequest: false};
        default:
            return state;
    }
};

export default personReducer;
