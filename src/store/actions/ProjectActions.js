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
    let projectsList = getState().project.projectsList;
    if (!projectsList) {
      const projectsListAxios = await fetchProjectsListAxios();
      projectsList = projectsListAxios.data;
    }

    let personsList = getState().project.personsList;
    if (!personsList) {
      const personsListAxios = await fetchPersonsListAxios();
      personsList = personsListAxios.data;
    }
    let institutionsList = getState().project.personsList;
    if (!institutionsList) {
      const institutionsListAxios = await fetchInstitutionsListAxios();
      institutionsList = institutionsListAxios.data;
    }

    const project = await fetchProjectAxios(id);
    const projectAction = fetchProjectAction({
      data: project.data,
      projectsList,
      institutionsList,
      personsList
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
