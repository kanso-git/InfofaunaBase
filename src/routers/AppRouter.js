import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Login from '../containers/Login/Login';
import {authActions} from '../store/actions';
import {connect} from 'react-redux';
import NotFoundPage from '../components/NotFoundPage/NotFoundPage';
import Dashboard from '../components/Dashboard/Dashboard';
import Projects from '../components/Projects/Projects';
import Persons from '../components/Persons/Persons';
import Institutions from '../components/Institutions/Institutions';
import Users from '../components/Users/Users';
import Table from '../components/Table/Table';
import Person from '../components/Persons/Person/Person';
import Project from '../components/Projects/Project/Project';
import Institution from '../components/Institutions/Institution/Institution';
import User from "../components/Users/User/User";
import {loadCurrentUserFromLocalStorage} from "../store/actions/AuthHelper";



export const history = createHistory();

const AppRouter = props => {
    // when user refreshs the page make sure to not redirect user to login page
    if (!props.auth.user) {
        const user = loadCurrentUserFromLocalStorage();
        if (user) {
            // console.log(`user form local storage: ${JSON.stringify(user, null, 3)}`);
            props.setCurrentUser(user);
        }
    }

    return (
        <Router history={history}>
            <Switch>
                <PublicRoute path="/login" component={Login}/>


                <PrivateRoute path="/persons" exact component={Persons}/>
                <PrivateRoute path="/persons/new" exact component={Person}/>
                <PrivateRoute path="/persons/:id" component={Person}/>

                <PrivateRoute path="/projects" exact component={Projects}/>
                <PrivateRoute path="/projects/new" exact component={Project}/>
                <PrivateRoute path="/projects/:id" component={Project}/>

                <PrivateRoute path="/institutions" exact component={Institutions}/>
                <PrivateRoute path="/institutions/new" exact component={Institution}/>
                <PrivateRoute path="/institutions/:id" component={Institution}/>


                <PrivateRoute path="/users" exact component={Users}/>
                <PrivateRoute path="/users/new" exact component={User}/>
                <PrivateRoute path="/users/:id" component={User}/>


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
