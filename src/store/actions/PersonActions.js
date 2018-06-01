import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators
const initiateFetchPersonAction = () => ({
  type: types.INITIATE_FETCH_PERSON
});

const fetchPersonAction = payload => ({
  type: types.FETCH_PERSON,
  payload
});

const errorFecthingPersonAction = payload => ({
  type: types.ERROR_FECTHING_PERSON,
  payload
});


// axios
const fetchPersonAxios = async (id) => {
  const url =`/api/persons/${id}`;
  console.log(`fetchPersonAxios url:${url}`);
  return axios.get(url);
};


// actions

const initiateFetchPerson = () => dispatch =>
  dispatch(initiateFetchPersonAction());

const fetchPerson = (id) => async (dispatch, getState) => {
  try {

    const person = await fetchPersonAxios(id);
    const personAction = fetchPersonAction(person.data);
    dispatch(personAction);
  } catch (e) {
    dispatch(errorFecthingPersonAction('error loading person detail'));
  }
};


export {
    initiateFetchPerson,
    fetchPerson
};
