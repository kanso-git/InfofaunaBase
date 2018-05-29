import * as types from '../actions/Types';

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: null
};

const burgerReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_INITIAL_IINGREDIENTS:
      return {
        ...state,
        ingredients: action.payload,
        totalPrice: 4,
        error: null
      };

    case types.ERROR_LOADING_INITIAL_IINGREDIENTS:
      return { ...state, error: action.payload };

    case types.ADD_INGREDIENT:
      return {
        ingredients: { ...state.ingredients, ...action.payload.ingredients },
        totalPrice: state.totalPrice + action.payload.totalPrice
      };
    case types.REMOVE_INGREDIENT:
      return {
        ingredients: { ...state.ingredients, ...action.payload.ingredients },
        totalPrice: state.totalPrice - action.payload.totalPrice
      };

    default:
      return state;
  }
};

export default burgerReducer;
