import React, { Component } from 'react';
import { Field, Form, withFormik } from 'formik';
import { string, object } from 'yup';

class ContactDataFormik extends Component {
  render() {
    console.log(`render fn :
        ${JSON.stringify(this.props, null, 3)}`);
    const { values, errors, touched, isSubmitting } = this.props;

    return (
      <Form>
        <div>
          {touched.email && errors.email && <p>{errors.email}</p>}
          <Field type="email" name="email" placeholder="email" />
        </div>

        <div>
          {touched.password && errors.password && <p>{errors.password}</p>}
          <Field type="password" name="password" placeholder="password" />
        </div>

        <label>
          <Field
            type="checkbox"
            name="newsletter"
            checked={values.newsletter}
          />
          Join us !!
        </label>
        <Field component="select" name="plan">
          <option value="free"> Free</option>
          <option value="premium">Premium</option>
        </Field>
        <button disabled={isSubmitting}>submit</button>
      </Form>
    );
  }
}

const FormikForm = withFormik({
  // we can passe the default values props from the parent component - useful for edit
  mapPropsToValues({ email, password, newsletter, plan }) {
    return {
      email: email || '',
      password: password || '',
      newsletter: newsletter || false,
      plan: plan || 'premium'
    };
  },
  handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
    // let's suppose that we do a server validtion call
    setTimeout(() => {
      console.log(values);
      if (values.email === 'abdallah.kanso@gmail.com') {
        setErrors({ email: 'That email is not to be used here ...' });
      } else {
        resetForm();
      }
      setSubmitting(false);
    }, 3000);
  },
  validationSchema: object().shape({
    email: string()
      .email('Email is not valid !')
      .required('Email is required ..'),
    password: string()
      .min(5, 'passowrd must be 5 or longer')
      .required('Password is required ...')
  })
})(ContactDataFormik);

ContactDataFormik.propTypes = {};

export default FormikForm;
