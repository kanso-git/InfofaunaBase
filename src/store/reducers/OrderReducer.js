import * as types from '../actions/Types';

const initialState = {
  list: [],
  error: null,
  ongoingPruchase: false,
  ongoingRequest: false
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIATE_FETCH_ORDERS:
      return { ...state, ongoingRequest: true };
    case types.ERROR_LOADING_LIST_ORDERS:
      return { ...state, error: action.payload, ongoingRequest: false };

    case types.LIST_ORDERS:
      return {
        ...state,
        list: action.payload,
        error: null,
        ongoingRequest: false
      };

    case types.INITIATE_ORDER_PURCHASE:
      return { ...state, ongoingPruchase: true };

    case types.END_ORDER_PURCHASE:
      return { ...state, ongoingPruchase: false };

    case types.ERROR_PLACING_ORDER:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default orderReducer;
