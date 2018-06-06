import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-infofauna';
import withErrorHandler from '../../components/withErrorHandler/withErrorHandler';
import { orderActions } from './../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
  componentWillMount() {
    this.props.initiateFetchOrders();
  }
  componentDidMount() {
    this.props.loadOrdersList();
  }
  render() {
    if (this.props.order.ongoingRequest) {
      return <Spinner />;
    } else {
      const ordersData = this.props.order.list;
      const orders = Object.keys(ordersData).map(o => {
        return (
          <Order
            key={o}
            {...ordersData[o].burger}
            {...ordersData[o].customer}
          />
        );
      });

      return <div>{orders}</div>;
    }
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { ...orderActions })(
  withErrorHandler(Orders, axios)
);
