import React from 'react';
import classes from './BuildControls.css';
import { ingredient as ing } from '../../../constants/ingredients';
import BuildControl from './BuildControl/BuildControl';
import { connect } from 'react-redux';
import { burgerActions } from '../../../store/actions';

const controls = [
  { label: 'Salad', type: ing.SALAD },
  { label: 'Cheese', type: ing.CHEESE },
  { label: 'Meat', type: ing.MEAT }
];

const buildControls = props => {
  let isPurchaseable = false;
  for (let key in props.burger.ingredients) {
    if (props.burger.ingredients[key] > 0) {
      isPurchaseable = true;
    }
  }
  return (
    <div className={classes.BuildControls}>
      <p>
        Current Price: <strong> {props.burger.totalPrice.toFixed(2)}</strong>
      </p>
      {controls.map(c => (
        <BuildControl {...props} key={c.label} type={c.type} label={c.label} />
      ))}
      <button
        className={classes.OrderButton}
        disabled={!isPurchaseable}
        onClick={props.showOrderSummary}
      >
        Order NOW
      </button>
    </div>
  );
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, { ...burgerActions })(buildControls);
