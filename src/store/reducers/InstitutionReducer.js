import * as types from '../actions/Types';

const initialState = {
  data: null,
  error: null,
  personsList: null,
  ongoingRequest: false
};

const institutionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIATE_FETCH_INSTITUTION:
      return { ...state, ongoingRequest: true };
    case types.ERROR_FECTHING_INSTITUTION:
      return { ...state, error: action.payload, ongoingRequest: false };
    case types.FETCH_INSTITUTION:
      return {
        ...state,
        data: action.payload.person,
        personsList: action.payload.personsList,
        error: null,
        ongoingRequest: false
      };

    default:
      return state;
  }
};

export default institutionReducer;
