import * as types from '../actions/Types';

const initialState = {
  data: null,
  error: null,
  ongoingFetch: true,
  projectsList: null
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ERROR_FECTHING_PROJECT:
      return { ...state, error: action.payload };
    case types.FETCH_PROJECT:
      return {
        ...state,
        data: action.payload.data,
        projectsList: action.payload.projectsList,
        error: null
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
