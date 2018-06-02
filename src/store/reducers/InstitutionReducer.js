import * as types from '../actions/Types';

const initialState = {
  data: null,
  error: null,
  personsList: null,
  ongoingFetch: false
};

const institutionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIATE_FETCH_INSTITUTION:
      return { ...state, ongoingFetch: true };
    case types.ERROR_FECTHING_INSTITUTION:
      return { ...state, error: action.payload, ongoingFetch: false };
    case types.FETCH_INSTITUTION:
      return {
        ...state,
        data: action.payload.person,
        personsList: action.payload.personsList,
        error: null,
        ongoingFetch: false
      };

    default:
      return state;
  }
};

export default institutionReducer;
