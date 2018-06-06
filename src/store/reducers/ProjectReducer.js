import * as types from '../actions/Types';

const initialState = {
  data: null,
  error: null,
  ongoingRequest: false,
  projectsList: null
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIATE_FETCH_PROJECT:
      return { ...state, error: null, ongoingRequest: true };
    case types.ERROR_FECTHING_PROJECT:
      return { ...state, error: action.payload, ongoingRequest: false };
    case types.FETCH_PROJECT:
      return {
        ...state,
        data: action.payload.data,
        projectsList: action.payload.projectsList,
        institutionsList: action.payload.institutionsList,
        personsList: action.payload.personsList,
        error: null,
        ongoingRequest: false
      };
    case types.FETCH_PROJECTS_LIST:
      return {
        ...state,
        projectsList: action.payload,
        error: null
      };

    default:
      return state;
  }
};

export default projectReducer;
