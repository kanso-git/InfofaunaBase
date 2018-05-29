import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';
import Button from '@material-ui/core/Button';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { authActions } from '../../../store/actions';
import { connect } from 'react-redux';

const navigationItems = props => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/" exact>
     Home
    </NavigationItem>
    <NavigationItem link="/projects">Projects</NavigationItem>

    <Button
      variant="raised"
      onClick={() => props.logout()}
      className={classes.Button}
    >
      Logout <ExitToApp />
    </Button>
  </ul>
);

export default connect(null, { ...authActions })(navigationItems);
