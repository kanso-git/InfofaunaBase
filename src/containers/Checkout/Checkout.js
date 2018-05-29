import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData2';
import { connect } from 'react-redux';

const Checkout = props => {
  const ingredients = props.burger.ingredients;
  if (!ingredients) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <CheckoutSummary
        ingredients={ingredients}
        checkoutCancelled={() => props.history.goBack()}
        checkoutContinued={() =>
          props.history.replace('/checkout/contact-data')
        }
      />
      <Route
        path={props.match.path + '/contact-data'}
        component={ContactData}
      />
    </div>
  );
};

const mapStateToProps = state => state;
export default connect(mapStateToProps)(Checkout);
