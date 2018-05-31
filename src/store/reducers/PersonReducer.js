import * as types from '../actions/Types';

const initialState = {
    data: null,
    error: null,
    ongoingFetch: true
};

const personReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.INITIATE_FETCH_PERSON:
            return {...state, ongoingFetch: true};
        case types.ERROR_FECTHING_PERSON:
            return {...state, error: action.payload, ongoingFetch: false};
        case types.FETCH_PERSON:
            return {
                ...state,
                data: action.payload,
                error: null,
                ongoingFetch: false
            };

        default:
            return state;
    }
};

export default personReducer;
