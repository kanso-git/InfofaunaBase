import * as types from '../actions/Types';

const initialState = {
  data: null,
  error: null,
  personsList: null,
  ongoingRequest: false,
    opreationType:null,
};

const institutionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.PREPARE_INSTITUTION_FORM_FOR_ADD:
          return {...initialState}
    case types.INITIATE_FETCH_INSTITUTION:
      return { ...state, ongoingRequest: true, opreationType:null };
    case types.ERROR_FECTHING_INSTITUTION:
    case types.ERROR_ADD_INSTITUTION:
    case types.ERROR_UPDATE_INSTITUTION:
      return { ...state, error: action.payload, ongoingRequest: false };
    case types.FETCH_INSTITUTION:
      return {
        ...state,
        data: action.payload.institution,
        error: null,
        opreationType:types.FETCH_OPREATION_TYPE,
        ongoingRequest: false
      };
    case types.FETCH_INSTITUTION_PERSON_LIST:
          return {
              ...state,
              personsList: action.payload.personsList,
              error: null,
              ongoingRequest: false
          };
    case types.ADD_INSTITUTION:
    case types.UPDATE_INSTITUTION:
    case types.DELETE_INSTITUTION:
          return {...state, ongoingRequest: false,  error: null,opreationType:action.payload};
    default:
      return state;
  }
};

export default institutionReducer;
