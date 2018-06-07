import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators
const initiateRequestProjectAction = () => ({
    type: types.INITIATE_FETCH_PROJECT
});

const fetchProjectAction = payload => ({
    type: types.FETCH_PROJECT,
    payload
});

const loadAdditionalDataProjectAction = payload => ({
    type: types.LOAD_ADDITIONAL_DATA_PROJECT,
    payload
});

const prepareFormAction = () => ({
    type: types.PREPARE_FORM_FOR_ADD
});

const updateProjectAction = () => ({
    type: types.UPDATE_PROJECT,
    payload: types.MODIFY_OPREATION_TYPE
});

const addNewProjectAction = () => ({
    type: types.ADD_PROJECT,
    payload: types.ADD_OPREATION_TYPE
});

const deleteProjectAction = () => ({
    type: types.DELETE_PROJECT,
    payload: types.DELETE_OPREATION_TYPE
});

const errorFecthingProjectAction = payload => ({
    type: types.ERROR_FECTHING_PROJECT,
    payload
});

const fetchProjectsListAction = payload => ({
    type: types.FETCH_PROJECTS_LIST,
    payload
});

const errorUpdatingProjectAction = payload => ({
    type: types.ERROR_UPDATE_PROJECT,
    payload
});

const errorAddingNewProjectAction = payload => ({
    type: types.ERROR_ADD_PROJECT,
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

const updateProjectAxios = async (id, updatedProject) => {
    const url = `/api/projects/${id}`;
    prepareDataHelper(updatedProject)
    console.log(`updateProjectAxios url:${url} ,updatedProject:${JSON.stringify(updatedProject, null, 3)} `);
    return axios.put(url, updatedProject);
};

const addNewProjectAxios = async (project) => {
    const url = `/api/projects/`;
    prepareDataHelper(project)
    console.log(`addNewProjectAxios url:${JSON.stringify(project, null, 3)}`);
    return axios.post(url, project);
};

const prepareDataHelper = (project) =>{
    if(project.projectProjectId === -1){
        project.projectProjectId = null;
    }
    if(project.principalInstitutionId === -1){
        project.principalInstitutionId = null;
    }
    if(project.principalInstitutionPersonId === -1){
        project.principalInstitutionPersonId = null;
    }
    if(project.mandataryInstitutionId === -1){
        project.mandataryInstitutionId = null;
    }
    if(project.mandataryInstitutionPersonId === -1){
        project.mandataryInstitutionPersonId = null;
    }
    return project
}

const deleteProjectAxios = (id) => {
    const url = `/api/projects/${id}`;
    console.log(`deleteProjectAxios url:${url}`);
    return axios.delete(url);
}


// actions

const initiateRequestProject = () => dispatch =>
    dispatch(initiateRequestProjectAction());

const fetchProject = id => async (dispatch, getState) => {
    try {
        const project = await fetchProjectAxios(id);
        const projectAction = fetchProjectAction({
            data: project.data,
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
        dispatch(errorFecthingProjectAction('error loading project list'));
    }
};


const updateProject = (id, updatedProject) => async (dispatch, getState) => {
    try {
        await updateProjectAxios(id, updatedProject);
        dispatch(updateProjectAction());
    } catch (e) {
        dispatch(errorUpdatingProjectAction('error updating project detail'));
    }
};

const addNewProject = (project) => async (dispatch, getState) => {
    try {
        const response = await addNewProjectAxios(project);
        dispatch(addNewProjectAction(types.ADD_OPREATION_TYPE));
        return response;
    } catch (e) {
        dispatch(errorAddingNewProjectAction('error adding new project'));
    }
};


const deleteProject = (id) => async (dispatch, getState) => {
    try {
        const project = await deleteProjectAxios(id);
        dispatch(deleteProjectAction());
    } catch (e) {
        dispatch(errorFecthingProjectAction('error loading project detail'));
    }
};

const loadAdditionalDataProject = (id) => async (dispatch, getState) => {
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

        const additionalDataAction = loadAdditionalDataProjectAction({
            projectsList,
            institutionsList,
            personsList
        });
        dispatch(additionalDataAction);
    } catch (e) {
        dispatch(errorFecthingProjectAction('error loading person detail'));
    }
}

const prepareForm = () => dispatch => dispatch(prepareFormAction());

export {
    initiateRequestProject,
    loadAdditionalDataProject,
    fetchProject,
    fetchProjectsList,
    updateProject,
    prepareForm,
    addNewProject,
    deleteProject
};
