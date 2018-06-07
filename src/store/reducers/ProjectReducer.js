import * as types from '../actions/Types';

const initialState = {
  data: null,
  error: null,
  ongoingRequest: false,
  projectsList: null,
    opreationType:null,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
      case types.PREPARE_FORM_FOR_ADD:
          return {...initialState}
    case types.INITIATE_FETCH_PROJECT:
      return { ...state, error: null, ongoingRequest: true , opreationType:null};
    case types.ERROR_FECTHING_PROJECT:
      return { ...state, error: action.payload, ongoingRequest: false };
    case types.FETCH_PROJECT:
      return {
        ...state,
        data: action.payload.data,
        error: null,
        ongoingRequest: false,
          opreationType:types.FETCH_OPREATION_TYPE
      };

      case types.LOAD_ADDITIONAL_DATA_PROJECT:
          return {
              ...state,
              projectsList: action.payload.projectsList,
              institutionsList: action.payload.institutionsList,
              personsList: action.payload.personsList,
              error: null,
              ongoingRequest: false,
              opreationType:types.FETCH_OPREATION_TYPE
          };
    case types.FETCH_PROJECTS_LIST:
      return {
        ...state,
        projectsList: action.payload,
        error: null
      };
      case types.ADD_PROJECT:
      case types.UPDATE_PROJECT:
      case types.DELETE_PROJECT:
          return {...state, ongoingRequest: false,  error: null,opreationType:action.payload};

    default:
      return state;
  }
};

export default projectReducer;
