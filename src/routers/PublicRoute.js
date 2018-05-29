import React ,{Fragment} from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Footer from "../components/Footer/Footer";

export const PublicRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    component={props => {
      const C = isAuthenticated ? (
        <Layout>
          <Redirect to="/" />
        </Layout>
      ) : (
          <Fragment>
              <Component {...props} />
              <Footer/>
          </Fragment>

      );
      return C;
    }}
  />
);

const mapStateToProps = state => ({
  isAuthenticated: state.auth.user !== null
});

export default connect(mapStateToProps)(PublicRoute);
