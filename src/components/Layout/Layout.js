import React, { Component, Fragment } from 'react';

import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

import './Layout.css';

class Layout extends Component {
  state = {
    showSideDrawer: false
  };

  sideDrawerCloseHandler = () => {
    this.setState(() => ({ showSideDrawer: false }));
  };
  sideDrawerToggleClickHandler = () => {
    this.setState(prevState => ({ showSideDrawer: !prevState.showSideDrawer }));
  };

  render() {
    return (
      <Fragment>
        <Toolbar drawerToggleClick={this.sideDrawerToggleClickHandler} />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerCloseHandler}
        />
        <main className="Content">{this.props.children}</main>
      </Fragment>
    );
  }
}

export default Layout;
