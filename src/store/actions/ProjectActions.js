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
const fetchProjectAxios = async id => {
  const url = `/api/projects/${id}`;
  console.log(`fetchProjectAxios url:${url}`);
  return axios.get(url);
};

const fetchProjectsListAxios = async () => {
  const url = `/api/projects/list`;
  console.log(`fetchProjectsListAxios url:${url}`);
  return axios.get(url);
};

const fetchPersonsListAxios = async () => {
  const url = `/api/persons/list`;
  console.log(`fetchPersonsListAxios url:${url}`);
  return axios.get(url);
};

const fetchInstitutionsListAxios = async () => {
  const url = `/api/institutions/list`;
  console.log(`fetchInstitutionsListAxios url:${url}`);
  return axios.get(url);
};
// actions

const initiateFetchProject = () => dispatch =>
  dispatch(initiateFetchProjectAction());

const fetchProject = id => async (dispatch, getState) => {
  try {
    const projectsList = await fetchProjectsListAxios();
    const personsList = await fetchPersonsListAxios();
    const institutionsList = await fetchInstitutionsListAxios();

    const project = await fetchProjectAxios(id);
    const projectAction = fetchProjectAction({
      data: project.data,
      projectsList: projectsList.data,
      institutionsList: institutionsList.data,
      personsList: personsList.data
    });
    dispatch(projectAction);
  } catch (e) {
    dispatch(errorFecthingProjectAction('error loading person detail'));
  }
};

const fetchProjectsList = () => async (dispatch, getState) => {
  try {
    const projectsList = await fetchProjectsListAxios();
    const projectsListAction = fetchProjectsListAction(projectsList.data);
    dispatch(projectsListAction);
  } catch (e) {
    dispatch(errorFecthingProjectAction('error loading person detail'));
  }
};

export { initiateFetchProject, fetchProject, fetchProjectsList };
