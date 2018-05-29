import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators

const initiateFetchOrdersAction = () => ({
  type: types.INITIATE_FETCH_ORDERS
});

const listOrderAction = payload => ({
  type: types.LIST_ORDERS,
  payload
});

const errorLoadingListOrderAction = payload => ({
  type: types.ERROR_LOADING_LIST_ORDERS,
  payload
});

const placeOrderAction = payload => ({
  type: types.PLACE_ORDER,
  payload
});

const errorPlaceOrderAction = payload => ({
  type: types.ERROR_PLACING_ORDER,
  payload
});

const initiatePurchaseAction = () => ({
  type: types.INITIATE_ORDER_PURCHASE
});

const endPurchaseAction = () => ({
  type: types.END_ORDER_PURCHASE
});

// axios
const loadOrdersAxios = async () => {
  return axios.get('/orders.json');
};

const placeOrdersAxios = async orderData => {
  return axios.post('/orders.json', orderData);
};

// actions

const initiateFetchOrders = () => dispatch =>
  dispatch(initiateFetchOrdersAction());
const loadOrdersList = () => async (dispatch, getState) => {
  try {
    const orders = await loadOrdersAxios();
    const ordersAction = listOrderAction(orders.data);
    dispatch(ordersAction);
  } catch (e) {
    dispatch(errorLoadingListOrderAction('error loading the orders'));
  }
};

const initiatePurchaseOrder = () => dispatch =>
  dispatch(initiatePurchaseAction());

const placeOrder = orderData => async (dispatch, getState) => {
  try {
    const order = await placeOrdersAxios(orderData);
    console.log(order);
    dispatch(endPurchaseAction());
  } catch (e) {
    dispatch(errorPlaceOrderAction('error placing order'));
  }
};

export {
  loadOrdersList,
  placeOrder,
  initiatePurchaseOrder,
  initiateFetchOrders
};
