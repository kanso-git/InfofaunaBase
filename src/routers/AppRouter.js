import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Login from "../containers/Login/Login";
import {LOCAL_STORAGE_USER_KEY} from '../store/actions/Types';
import {authActions} from '../store/actions'
import {connect} from "react-redux";
import NotFoundPage from "../components/NotFoundPage/NotFoundPage";
import Dashboard from "../components/Dashboard/Dashboard";
import Projects from "../components/Project/Projects";

const loadCurrentUserFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY))
}

export const history = createHistory();

const AppRouter = (props) => {

    // when user refreshs the page make sure to not redirect user to login page
    if (!props.auth.user) {
        const user = loadCurrentUserFromLocalStorage();
        if (user) {
            console.log(`user form local storage: ${JSON.stringify(user, null, 3)}`);
            props.setCurrentUser(user);
        }
    }

    return (
        <Router history={history}>
            <Switch>
                <Route path="/login" exact component={Login}/>
                <PrivateRoute path="/projects"  component={Projects}/>
                <PrivateRoute path="/" exact component={Dashboard}/>

                {/*
                     <PrivateRoute path="/checkout" component={Checkout}/>
                     <PrivateRoute path="/orders" component={Orders}/>
                     <PrivateRoute path="/formik" component={ContactDataFormik}/>
                     <PrivateRoute path="/" exact component={BurgerBuilder}/>

               */}

                <Route component={NotFoundPage}/>
            </Switch>
        </Router>
    );
};

const mapStateToProps = state => state;
export default connect(mapStateToProps, {...authActions})(AppRouter);
