import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators
const initiateFetchProjectAction = () => ({
    type: types.INITIATE_FETCH_PROJECT
});

const fetchProjectAction = payload => ({
    type: types.FETCH_PROJECT,
    payload

});

const errorFecthingProjectAction = payload => ({
    type: types.ERROR_FECTHING_PROJECT,
    payload
});


const fetchProjectsListAction = payload => ({
    type: types.FETCH_PROJECTS_LIST,
    payload

});


// axios
const fetchProjectAxios = async (id) => {
    const url =`/api/projects/${id}`;
    console.log(`fetchProjectAxios url:${url}`);
    return axios.get(url);
};


const fetchProjectsListAxios = async () => {
    const url =`/api/projects/list`;
    console.log(`fetchProjectsListAxios url:${url}`);
    return axios.get(url);
};


// actions

const initiateFetchProject = () => dispatch =>
    dispatch(initiateFetchProjectAction());

const fetchProject = (id) => async (dispatch, getState) => {
    try {

        const project = await fetchProjectAxios(id);
        const projectAction = fetchProjectAction(project.data);
        dispatch(projectAction);
    } catch (e) {
        dispatch(errorFecthingProjectAction('error loading person detail'));
    }
};

const fetchProjectsList= () => async (dispatch, getState) => {
    try {

        const projectsList = await fetchProjectsListAxios();
        const projectsListAction = fetchProjectsListAction(projectsList.data);
        dispatch(projectsListAction);
    } catch (e) {
        dispatch(errorFecthingProjectAction('error loading person detail'));
    }
};

export {
    initiateFetchProject,
    fetchProject,
    fetchProjectsList,
};
