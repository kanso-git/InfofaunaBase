import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators

const initiateFetchProjectsAction = () => ({
    type: types.INITIATE_FETCH_PROJECTS
});

const listProjectsAction = payload => ({
    type: types.LIST_PROJECTS,
    payload
});

const errorLoadingListProjectsAction = payload => ({
    type: types.ERROR_LOADING_LIST_PROJECTS,
    payload
});



// axios
const loadProjectsAxios = async (params) => {
    //api/projects/?pageSize=20&page=1&orderBy=designation&sortOrder=asc
    return axios.get('/api/projects/list');
};



// actions

const initiateFetchOrders = () => dispatch =>
    dispatch(initiateFetchProjectsAction());
const loadOrdersList = () => async (dispatch, getState) => {
    try {
        const projects = await loadProjectsAxios();
        const projectsAction = listProjectsAction(projects.data);
        dispatch(projectsAction);
    } catch (e) {
        dispatch(errorLoadingListProjectsAction('error loading the orders'));
    }
};



export {
    loadOrdersList,
    initiateFetchOrders
};
