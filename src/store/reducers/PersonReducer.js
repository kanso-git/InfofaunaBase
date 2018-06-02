import * as types from '../actions/Types';

const initialState = {
  data: null,
  error: null
};

const personReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ERROR_FECTHING_PERSON:
      return { ...state, error: action.payload };
    case types.FETCH_PERSON:
      return {
        ...state,
        data: action.payload,
        error: null
      };

    default:
      return state;
  }
};

export default personReducer;
