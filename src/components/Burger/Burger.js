import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import { withRouter } from 'react-router-dom';

const tarnsformIngredientToBurgerIngredient = props => {
  console.log('tarnsformIngredientToBurgerIngredient >>');
  const ingredientKeys = Object.keys(props.ingredients);

  const ingredientsList = ingredientKeys.map(ingKey => {
    const arr = [...Array(props.ingredients[ingKey])]; // this is import to spread the array
    const arr2 = arr.map((_, i) => (
      <BurgerIngredient key={ingKey + i} type={ingKey} />
    ));
    return arr2;
  });
  const flattenedArray = [].concat(...ingredientsList);
  console.log(flattenedArray);

  return flattenedArray.length > 0 ? (
    flattenedArray
  ) : (
    <p> Please Start adding your ingredients </p>
  );
};
const burger = props => {
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {props.ingredients && tarnsformIngredientToBurgerIngredient(props)}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default withRouter(burger);
