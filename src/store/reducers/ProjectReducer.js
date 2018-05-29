import * as types from '../actions/Types';

const initialState = {
  list: [],
  error: null,
  ongoingFetch: false
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIATE_FETCH_PROJECTS:
      return { ...state, ongoingFetch: true };
    case types.ERROR_LOADING_LIST_PROJECTS:
      return { ...state, error: action.payload, ongoingFetch: false };

    case types.LIST_PROJECTS:
      return {
        ...state,
        list: action.payload,
        error: null,
        ongoingFetch: false
      };

    default:
      return state;
  }
};

export default projectReducer;
