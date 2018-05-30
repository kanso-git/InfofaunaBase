import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import navigationItemsCss from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';
import Button from '@material-ui/core/Button';
import ExitToApp from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { authActions } from '../../../store/actions';
import { connect } from 'react-redux';
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  button: {
    margin: theme.spacing.unit,
    marginBottom: 20,
    marginRight: 0,
    color: '#2196f3'
  }
});

class NavigationItems extends React.Component {
  state = {
    anchorEl: null
  };
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
    //this.props.logout();
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <ul className={navigationItemsCss.NavigationItems}>
        <NavigationItem link="/" exact>
          Home
        </NavigationItem>
        <NavigationItem link="/persons">Personnes</NavigationItem>
        <NavigationItem link="/projects">Projects</NavigationItem>
        <NavigationItem link="/institutions">Institutions</NavigationItem>
        <NavigationItem link="/users">Users</NavigationItem>

        {/*
                     <Button
                    variant="raised"
                    onClick={() => this.props.logout()}
                    className={navigationItemsCss.Button}
                >
                    Logout <ExitToApp />
                </Button>
                     */}

        <div>
          <Button
            size="large"
            aria-owns={open ? 'menu-appbar' : null}
            aria-haspopup="true"
            onClick={this.handleMenu}
            className={classes.button}
          >
            <AccountCircle />{' '}
            <span className={navigationItemsCss.User}>
              {this.props.user.username}
            </span>
            <b className={navigationItemsCss.Caret} />
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
            <MenuItem onClick={this.handleClose}>
              {' '}
              Logout <ExitToApp />
            </MenuItem>
          </Menu>
        </div>
      </ul>
    );
  }
}

NavigationItems.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => state.auth;
export default connect(mapStateToProps, { ...authActions })(
  withStyles(styles)(NavigationItems)
);
