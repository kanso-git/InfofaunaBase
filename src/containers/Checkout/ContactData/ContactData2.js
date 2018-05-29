import React, { Component } from 'react';
import { Field, Form, withFormik } from 'formik';
import { object, string } from 'yup';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import classes from './ContactData.css';
import { orderActions } from '../../../store/actions';
import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';
import axios from '../../../axios-infofauna';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';

class ContactData extends Component {
  render() {
    if (!this.props.order.ongoingPruchase) {
      return <Redirect to="/" />;
    }
    console.log(`render fn :
        ${JSON.stringify(this.props, null, 3)}`);
    const { values, errors, touched, isSubmitting, isValid } = this.props;
    this.formElements = (
      <div className={classes.ContcatData}>
        <h4>Enter your contact data</h4>
        <Form>
          <div className={classes.GroupControl}>
            {touched.name && errors.name && <p>{errors.name}</p>}
            <Field
              type="input"
              name="name"
              autoComplete="name"
              className={touched.name && errors.name && classes.Invalid}
              placeholder="Your Name"
            />
          </div>

          <div className={classes.GroupControl}>
            {touched.street && errors.street && <p>{errors.street}</p>}
            <Field type="input" name="street" placeholder="Your Address" />
          </div>

          <div className={classes.GroupControl}>
            {touched.zipCode && errors.zipCode && <p>{errors.zipCode}</p>}
            <Field type="input" name="zipCode" placeholder="Your ZipCode" />
          </div>

          <div className={classes.GroupControl}>
            {touched.country && errors.country && <p>{errors.country}</p>}
            <Field type="input" name="country" placeholder="Your Country" />
          </div>

          <div className={classes.GroupControl}>
            {touched.email && errors.email && <p>{errors.email}</p>}
            <Field
              type="email"
              className={touched.email && errors.email && classes.Invalid}
              name="email"
              placeholder="Your Email"
            />
          </div>
          <div className={classes.GroupControl}>
            <Field component="select" name="deliveryMethod">
              <option value="fast">Fast</option>
              <option value="standard">Standard</option>
            </Field>
          </div>
          <Button
            variant="raised"
            color="primary"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Order
          </Button>
        </Form>
      </div>
    );

    return this.formElements;
  }
}

const FormikForm = withFormik({
  // we can passe the default values props from the parent component - useful for edit
  mapPropsToValues({ name, street, zipCode, country, email, deliveryMethod }) {
    return {
      name: name || '',
      street: street || '',
      zipCode: zipCode || '',
      country: country || '',
      email: email || '',
      deliveryMethod: deliveryMethod || 'standard'
    };
  },
  handleSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
    // let's suppose that we do a server validtion call
    //console.log(values);
    if (values.email === 'abdallah.kanso@gmail.com') {
      setErrors({ email: 'That email is not to be used here ...' });
    } else {
      const orderData = {
        burger: props.burger,
        customer: { ...values }
      };
      // initiate the purchase process
      props.placeOrder(orderData);
    }
    setSubmitting(false);
  },
  validationSchema: object().shape({
    name: string().required('Name is required'),
    street: string().required('Street is required'),
    zipCode: string()
      .min(4, 'ZipCode must be 4 or longer')
      .max(6, 'ZipCode must not be longer than 6')
      .required('ZipCode is required ...'),
    country: string().required('Country is required'),
    email: string()
      .email('Email is not valid !')
      .required('Email is required ..')
  })
})(ContactData);

ContactData.propTypes = {};

const mapStateToProps = state => state;
export default connect(mapStateToProps, { ...orderActions })(
  withErrorHandler(FormikForm, axios)
);
