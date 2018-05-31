import React, { Component, Fragment } from 'react';
import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
  // Since the modal includes other components Backdrop, we should test the props.children
  // otherwise any update on the childern will not cause a re-render
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.show != nextProps.show ||
      nextProps.children != this.props.children
    );
  }

  render() {
    return (
      <Fragment>
        <Backdrop
          show={this.props.show}
          hideBackdrop={this.props.hideBackdrop}
        />
        <div
          className="Modal"
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? 1 : 0
          }}
        >
          {this.props.children}
        </div>
      </Fragment>
    );
  }
}

export default Modal;
