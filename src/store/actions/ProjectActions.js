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

    const reqParam = Object.key(params)
        .map(k => `${k}=${params[k]}`).join('&')
    console.log(`loadProjectsAxios :reqParam:${reqParam}`);
    return axios.get(`/api/projects/?${reqParam}`);
};



// actions

const initiateFetchProjects = () => dispatch =>
    dispatch(initiateFetchProjectsAction());

const loadProjects = (param) => async (dispatch, getState) => {
    try {
        const projects = await loadProjectsAxios(param);
        const projectsAction = listProjectsAction(projects.data);
        dispatch(projectsAction);
    } catch (e) {
        dispatch(errorLoadingListProjectsAction('error loading the orders'));
    }
};



export {
    loadProjects,
    initiateFetchProjects
};
