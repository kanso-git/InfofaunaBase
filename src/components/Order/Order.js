import React from 'react';
import classes from './Order.css';

const Order = props => {
  const ingredients = [];
  for (let i in props.ingredients) {
    const ingredient = {
      name: i,
      amount: +props.ingredients[i]
    };
    ingredients.push(ingredient);
  }
  return (
    <div className={classes.Order}>
      <p>
        Ingredients :{' '}
        {ingredients.map(ing => (
          <span
            style={{
              textTransform: 'capitalized',
              display: 'inline-block',
              margin: '0 8px',
              border: '1px solid #ccc',
              padding: '5px'
            }}
            key={ing.name}
          >
            {ing.name} ({ing.amount})
          </span>
        ))}
      </p>

      <p>
        <span>
          <strong>Price: ${props.totalPrice}</strong>
        </span>
      </p>
    </div>
  );
};

export default Order;
