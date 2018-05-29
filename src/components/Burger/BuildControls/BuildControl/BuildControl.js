import React from 'react';
import classes from './BuildControl.css';

const buildControl = props => (
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <button
            className={classes.Less}
            onClick={() => props.removeIngredient(props.type)}
            disabled={props.burger.ingredients[props.type] === 0}
        >
            -
        </button>
        <button
            className={classes.More}
            onClick={() => props.addIngredient(props.type)}
        >
            +
        </button>
    </div>
);

export default buildControl;
