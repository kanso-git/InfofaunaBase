import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik } from 'formik';
import { object, string } from 'yup';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import loginCss from './Login.css';

import backgroundImage from '../../assets/images/bg-01.jpg';
import withErrorHandler from '../../components/withErrorHandler/withErrorHandler';

import axios from '../../axios-infofauna';
import { authActions } from '../../store/actions';
import { Redirect } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  formControl: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
});

class Login extends Component {
  state = {
    showPassword: false
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    console.log('>>>>>>>>>>>> Login render >>>>>>>>>>>>>>>>>');
    if (this.props.auth.user) {
      return <Redirect to="/" />;
    }
    const { classes } = this.props;
    const {
      values,
      errors,
      touched,
      dirty,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      isValid
    } = this.props;
    console.log(this.error);
    console.log(this.touched);
    return (
      <div className={loginCss.Limiter}>
        <div className={loginCss.ContainerLogin100}>
          <div className={loginCss.WrapLogin100}>
            <div
              className={loginCss.Login100FormTitle}
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              <span className={loginCss.Login100FormTitle1}>Sign In</span>
            </div>

            {this.props.auth.error !== null ? (
              <div className={loginCss.ErrorLogin}>
                Nom d'utilisateur ou mot de passe invalide
              </div>
            ) : null}
            <Form>
              <FormControl
                className={classes.formControl}
                error={touched.username && errors.username ? true : false}
              >
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  id="username"
                  type="input"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                />
                {touched.username &&
                  errors.username && (
                    <FormHelperText id="username-text">
                      {errors.username}
                    </FormHelperText>
                  )}
              </FormControl>

              <FormControl
                className={classes.formControl}
                error={touched.password && errors.password ? true : false}
                aria-describedby="password-text"
              >
                <InputLabel htmlFor="password">Password</InputLabel>

                <Input
                  id="password"
                  type={this.state.showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />

                {touched.password &&
                  errors.password && (
                    <FormHelperText id="password-text">
                      {errors.password}
                    </FormHelperText>
                  )}
              </FormControl>
              <br />
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                disabled={isSubmitting || !isValid}
                className={classes.button}
              >
                {this.props.auth.startLogin ? 'Loging ...' : 'Login'}
              </Button>
            </Form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const LoginForm = withFormik({
  // we can passe the default values props from the parent component - useful for edit
  mapPropsToValues({ username, password }) {
    return {
      username: username || '',
      password: password || ''
    };
  },
  handleSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
    // let's suppose that we do a server validtion call
    props.initiateLogin();
    props.login(values);
    setSubmitting(false);
  },
  validationSchema: object().shape({
    username: string().required('username is required ..'),
    password: string()
      .min(5, 'passowrd must be 5 or longer')
      .required('Password is required ...')
  })
})(Login);

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => state;

export default connect(mapStateToProps, { ...authActions })(
  withStyles(styles)(LoginForm)
);
