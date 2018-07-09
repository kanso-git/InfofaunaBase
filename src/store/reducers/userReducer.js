import * as types from '../actions/Types';

const initialState = {
    data: null,
    error: null,
    personsList: null,
    roles: null,
    groups: null,
    supportedLanguagesList:null,
    ongoingRequest: false,
    opreationType: null,
    enableDelete:false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.PREPARE_USER_FORM_FOR_ADD:
            return {...initialState}
        case types.INITIATE_FETCH_USER:
            return {...state, ongoingRequest: true, opreationType: null};
        case types.ERROR_FECTHING_USER:
        case types.ERROR_ADD_USER:
        case types.ERROR_UPDATE_USER:
            return {...state, error: action.payload, ongoingRequest: false};
        case types.FETCH_USER:
            return {
                ...state,
                data: action.payload.user,
                error: null,
                opreationType: types.FETCH_OPREATION_TYPE,
                ongoingRequest: false
            };
        case types.FETCH_USER_ADDITIONAL_DATA_LIST:
            return {
                ...state,
                personsList: action.payload.personsList,
                languagesList: action.payload.languagesList,
                error: null,
                ongoingRequest: false
            };
        case types.FETCH_USER_ROLES_AND_GROUPS:
            return {
                ...state,
                roles: action.payload.roles,
                groups: action.payload.groups,
                enableDelete:action.payload.enableDelete,
                error: null,
                ongoingRequest: false
            };
        case types.ADD_USER:
        case types.UPDATE_USER:
        case types.DELETE_USER:
            return {...state, ongoingRequest: false, error: null, opreationType: action.payload};
        default:
            return state;
    }
};

export default userReducer;
