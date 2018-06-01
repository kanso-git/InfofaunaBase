import * as types from '../actions/Types';

const initialState = {
    data: null,
    error: null,
    ongoingFetch: true,
    projectsList:null
};

const projectReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.INITIATE_FETCH_PROJECT:
            return {...state, ongoingFetch: true};
        case types.ERROR_FECTHING_PROJECT:
            return {...state, error: action.payload, ongoingFetch: false};
        case types.FETCH_PROJECT:
            return {
                ...state,
                data: action.payload,
                error: null,
                ongoingFetch: false
            };
        case types.FETCH_PROJECTS_LIST:
        return {
            ...state,
            projectsList: action.payload
        }

        default:
            return state;
    }
};

export default projectReducer;
