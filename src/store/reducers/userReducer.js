import * as types from '../actions/Types';

const initialState = {
  data: null,
  error: null,
  personsList: null,
  ongoingRequest: false,
    opreationType:null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.PREPARE_USER_FORM_FOR_ADD:
          return {...initialState}
    case types.INITIATE_FETCH_USER:
      return { ...state, ongoingRequest: true, opreationType:null };
    case types.ERROR_FECTHING_USER:
    case types.ERROR_ADD_USER:
    case types.ERROR_UPDATE_USER:
      return { ...state, error: action.payload, ongoingRequest: false };
    case types.FETCH_USER:
      return {
        ...state,
        data: action.payload.user,
        error: null,
        opreationType:types.FETCH_OPREATION_TYPE,
        ongoingRequest: false
      };
    case types.FETCH_USER_PERSON_LIST:
          return {
              ...state,
              personsList: action.payload.personsList,
              error: null,
              ongoingRequest: false
          };
    case types.ADD_USER:
    case types.UPDATE_USER:
    case types.DELETE_USER:
          return {...state, ongoingRequest: false,  error: null,opreationType:action.payload};
    default:
      return state;
  }
};

export default userReducer;
