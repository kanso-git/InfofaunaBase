import axios from '../../axios-infofauna';
import * as types from './Types';

const PRICE_INGREDIENTS = {
  salad: 0.7,
  bacon: 0.5,
  cheese: 0.5,
  meat: 1.5
};

// action generator
const loadInitialIngredientsAction = payload => ({
  type: types.LOAD_INITIAL_IINGREDIENTS,
  payload
});

const errorLoadingInitialIngredientsAction = payload => ({
  type: types.ERROR_LOADING_INITIAL_IINGREDIENTS,
  payload
});

const addIngredientAction = payload => ({
  type: types.ADD_INGREDIENT,
  payload
});

const removeIngredientAction = payload => ({
  type: types.REMOVE_INGREDIENT,
  payload
});

// axios
const loadIngredientsAxios = async () => {
  return axios.get('/ingredients.json');
};

// actions handler
const loadInitialIngredients = () => async (dispatch, getState) => {
  try {
    const ingredients = await loadIngredientsAxios();
    const initialIngredientsAction = loadInitialIngredientsAction(
      ingredients.data
    );
    dispatch(initialIngredientsAction);
  } catch (e) {
    // error case : needs to shutdown the spinner
    dispatch(
      errorLoadingInitialIngredientsAction('error loading the ingredients')
    );
  }
};

const addIngredient = type => (dispatch, getState) => {
  const oldCount = getState().burger.ingredients[type];
  const newCount = oldCount + 1;
  const updatedIngredient = {
    ...getState().burger.ingredients
  };
  updatedIngredient[type] = newCount;
  const payload = {
    ingredients: { ...updatedIngredient },
    totalPrice: PRICE_INGREDIENTS[type]
  };
  dispatch(addIngredientAction(payload));
};

const removeIngredient = type => (dispatch, getState) => {
  const oldCount = getState().burger.ingredients[type];
  const newCount = oldCount - 1;
  const updatedIngredient = {
    ...getState().burger.ingredients
  };
  updatedIngredient[type] = newCount;
  const payload = {
    ingredients: { ...updatedIngredient },
    totalPrice: PRICE_INGREDIENTS[type]
  };
  dispatch(removeIngredientAction(payload));
};

export { loadInitialIngredients, addIngredient, removeIngredient };
