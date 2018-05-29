import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import Burger from '../../components/Burger/Burger';
import BuilderControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import axios from '../../axios-infofauna';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/withErrorHandler/withErrorHandler';

import { burgerActions, orderActions } from '../../store/actions';

class BurgerBuilder extends Component {
  state = {
    showModal: false
  };

  componentDidMount() {
    if (!this.props.burger.ingredients) {
      this.props.loadInitialIngredients();
    }
  }

  showHideOrderSummaryHandler = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  orderCheckoutHandler = () => {
    console.log(this.props);
    this.props.initiatePurchaseOrder();
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  render() {
    console.log(this.props);
    let orderSummary = (
      <OrderSummary
        cancelOrder={this.showHideOrderSummaryHandler}
        purchaseOrder={() => this.props.history.push('/checkout')}
      />
    );
    let burger = (
      <Fragment>
        <Burger ingredients={this.props.burger.ingredients} />
        <BuilderControls showOrderSummary={this.orderCheckoutHandler} />
      </Fragment>
    );

    if (!this.props.burger.ingredients && !this.props.burger.error) {
      orderSummary = <Spinner />;
      burger = <Spinner />;
    } else if (this.props.burger.error) {
      console.error(this.props.burger.error);
      orderSummary = null;
      burger = null;
    }

    return (
      <Fragment>
        <Modal
          show={this.state.showModal}
          hideBackdrop={this.showHideOrderSummaryHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Fragment>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { ...burgerActions, ...orderActions })(
  withErrorHandler(BurgerBuilder, axios)
);
