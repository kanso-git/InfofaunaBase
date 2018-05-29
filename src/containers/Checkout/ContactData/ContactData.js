import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-infofauna';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from "react-redux";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        label: '',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        changed: e => this.onChangeHandler(e, 'name'),
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Street'
        },
        changed: e => this.onChangeHandler(e, 'street'),
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Postal Code'
        },
        changed: e => this.onChangeHandler(e, 'zipCode'),
        value: '',
        validation: {
          required: true,
          minLenght: 4,
          maxLenght: 6
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Country'
        },
        changed: e => this.onChangeHandler(e, 'country'),
        value: 'Switzerland',
        validation: {
          required: true
        },
        valid: true,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Email'
        },
        changed: e => this.onChangeHandler(e, 'email'),
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'f', displayValue: 'Fast' },
            { value: 'c', displayValue: 'Cheap' }
          ]
        },
        changed: e => this.onChangeHandler(e, 'deliveryMethod'),
        value: 'f'
      },
      valid: false
    },
    loading: false
  };

  checkValidityElement = (value, rules) => {
    let isValid = true;
    if (rules) {
      const requiredValidation = rules.required
        ? value.trim().length > 0
        : true;
      const minLengthValidation = rules.minLenght
        ? value.trim().length >= rules.minLenght
        : true;
      const MaxLenghtValidation = rules.maxLenght
        ? value.trim().length <= rules.maxLenght
        : true;

      isValid =
        requiredValidation && minLengthValidation && MaxLenghtValidation;
    }
    return isValid;
  };

  checkValidityForm = () => {
    const orderForm = { ...this.state.orderForm };
    const notValidElemIndex = Object.keys(orderForm).findIndex(
      elem => orderForm[elem].valid != null && !orderForm[elem].valid
    );
    console.log('checkValidityForm:' + notValidElemIndex);
    return notValidElemIndex === -1 ? true : false;
  };

  onChangeHandler = (e, key) => {
    const updatedOrderForm = { ...this.state.orderForm };
    updatedOrderForm[key].value = e.target.value;
    updatedOrderForm[key].touched = true;
    updatedOrderForm[key].valid = this.checkValidityElement(
      e.target.value,
      updatedOrderForm[key].validation
    );
    updatedOrderForm.valid = this.checkValidityForm();

    this.setState(() => ({ orderForm: updatedOrderForm }));
  };

  orderHandler = event => {
    event.preventDefault();
    const formData = {};
    for (let el in this.state.orderForm) {
      formData[el] = this.state.orderForm[el].value;
    }

    const order = {
      customer: { ...formData },
      ingredients: this.props.burger.ingredients,
      price: this.props.burger.totalPrice
    };

    console.log(`the order before send save in DB:
     ${JSON.stringify(order, null, 3)}`);

    this.setState(() => ({ loading: true }));
    axios
      .post('/orders.json', order)
      .then(response => {
        if (response.status !== 404) {
          this.setState(prevState => ({
            loading: false
          }));
          this.props.history.push('/');
        } else {
          this.setState(prevState => ({
            loading: false
          }));
        }
      })
      .catch(e => {
        this.setState(prevState => ({
          loading: false
        }));
      });
  };

  render() {
    console.log('orderForm valid:' + this.state.orderForm.valid);
    const formElementsArray = [];

    for (let el in this.state.orderForm) {
      const elemObj = this.state.orderForm[el];
      formElementsArray.push(<Input key={el} {...elemObj} />);
    }
    let formElements = (
      <div className={classes.ContcatData}>
        <h4>Enter your contact data</h4>
        <form onSubmit={this.orderHandler}>
          {formElementsArray}

          <Button btnType={'Success'} disabled={!this.state.orderForm.valid}>
            Order
          </Button>
        </form>
      </div>
    );
    if (this.state.loading) {
      formElements = <Spinner />;
    }
    return formElements;
  }
}


const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(ContactData)

