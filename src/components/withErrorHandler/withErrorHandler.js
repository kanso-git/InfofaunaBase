import React, { Fragment, Component } from 'react';
import Modal from '../UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    };

    requestInterceptors = null;
    responseInterceptors = null;

    // use this method tp catch error that comes from the child component mainly
    componentWillMount() {
      this.requestInterceptors = axios.interceptors.request.use(req => {
         if(this.state.error) {
           this.setState(() => ({ error: null }));
         }
        return req;
      });
      this.responseInterceptors = axios.interceptors.response.use(
        res => res,
        error => {
          this.setState(() => ({
            error
          }));
        }
      );
    }

    componentWillUnmount() {
      console.log(
        '>>>>>>>>>>> withErrorHandler::componentWillUnmount >>>>>>>>>'
      );
      axios.interceptors.request.eject(this.requestInterceptors);
      axios.interceptors.response.eject(this.responseInterceptors);
    }
    errorConfirmedHandler = () => {
      this.setState(() => ({ error: null }));
    };
    render() {
      return (
        <Fragment>
          <Modal
            show={this.state.error}
            hideBackdrop={this.errorConfirmedHandler}
          >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Fragment>
      );
    }
  };
};

export default withErrorHandler;
