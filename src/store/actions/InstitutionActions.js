import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators
const initiateFetchInstitutionAction = () => ({
  type: types.INITIATE_FETCH_INSTITUTION
});

const fetchInstitutionAction = payload => ({
  type: types.FETCH_INSTITUTION,
  payload
});

const errorFecthingInstitutionAction = payload => ({
  type: types.ERROR_FECTHING_INSTITUTION,
  payload
});

// axios
const fetchInstitutionAxios = async id => {
  const url = `/api/institutions/${id}`;
  console.log(`fetchPersonAxios url:${url}`);
  return axios.get(url);
};

const fetchPersonsListAxios = async () => {
  const url = `/api/persons/list`;
  console.log(`fetchPersonsListAxios url:${url}`);
  return axios.get(url);
};

// actions

const initiateFetchInstitution = () => dispatch =>
  dispatch(initiateFetchInstitutionAction());

const fetchInstitution = id => async (dispatch, getState) => {
  try {
    let personsList = getState().institution.personsList;
    if (!personsList) {
      const personsListAxios = await fetchPersonsListAxios();
      personsList = personsListAxios.data;
    }
    const person = await fetchInstitutionAxios(id);
    const personAction = fetchInstitutionAction({
      person: person.data,
      personsList
    });
    dispatch(personAction);
  } catch (e) {
    dispatch(errorFecthingInstitutionAction('error loading person detail'));
  }
};

export { initiateFetchInstitution, fetchInstitution };
