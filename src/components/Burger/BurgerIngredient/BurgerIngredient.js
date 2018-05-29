import React, {Component} from 'react';

import classes from './BurgerIngredient.css';
import PropTypes from 'prop-types';
import {ingredient as ing} from '../../../constants/ingredients';

class BurgerIngredient extends Component {
    render() {
        let ingredient = null;
        switch (this.props.type) {
            case ing.BREAD_BOTTOM:
                ingredient = <div className={classes.BreadBottom}></div>;
                break;
            case ing.BREAD_TOP:
                ingredient = (
                    <div className={classes.BreadTop}>
                        <div className={classes.Seeds1}/>
                        <div className={classes.Seeds2}/>
                    </div>
                );
                break;
            case ing.MEAT:
                ingredient = <div className={classes.Meat}></div>;
                break;
            case ing.CHEESE:
                ingredient = <div className={classes.Cheese}/>;
                break;
            case ing.SALAD:
                ingredient = <div className={classes.Salad}/>;
                break;
            case ing.BACON:
                ingredient = <div className={classes.Bacon}/>;
                break;

            default:
                ingredient = null;
                break;
        }
        return ingredient;
    }
}

BurgerIngredient.propTypes = {
    type: PropTypes.string.isRequired
};
export default BurgerIngredient;
