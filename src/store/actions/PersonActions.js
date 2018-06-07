import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators
const initiateRequestPersonAction = () => ({
  type: types.INITIATE_FETCH_PERSON
});

const fetchPersonAction = payload => ({
  type: types.FETCH_PERSON,
  payload
});

const prepareFormAction = () =>({
    type: types.PREPARE_FORM_FOR_ADD
})

const updatePersonAction =() => ({
    type: types.UPDATE_PERSON,
    payload:types.MODIFY_OPREATION_TYPE
});

const addNewPersonAction = () => ({
    type: types.ADD_PERSON,
    payload:types.ADD_OPREATION_TYPE
});

const deletePersonAction =() => ({
    type: types.DELETE_PERSON,
    payload:types.DELETE_OPREATION_TYPE
});

const errorFecthingPersonAction = payload => ({
  type: types.ERROR_FECTHING_PERSON,
  payload
});

const errorUpdatingPersonAction = payload => ({
    type: types.ERROR_UPDATE_PERSON,
    payload
});

const errorAddingNewPersonAction = payload => ({
    type: types.ERROR_ADD_PERSON,
    payload
});


// axios
const fetchPersonAxios = async (id) => {
  const url =`/api/persons/${id}`;
  console.log(`fetchPersonAxios url:${url}`);
  return axios.get(url);
};

const updatePersonAxios = async (id, updatedPerson) => {
    const url =`/api/persons/${id}`;
    console.log(`updatePersonAxios url:${url} ,updatedPerson:${JSON.stringify(updatedPerson,null,3)} `);
    return axios.put(url,updatedPerson);
};

const addNewPersonAxios = async (person) => {
    const url =`/api/persons/`;
    console.log(`addNewPersonAxios url:${JSON.stringify(person,null,3)}`);
    return axios.post(url,person);
};


const deletePersonAxios = (id) =>{
    const url =`/api/persons/${id}`;
    console.log(`deletePersonAxios url:${url}`);
    return axios.delete(url);
}



// actions

const initiateRequestPerson = () => dispatch =>
  dispatch(initiateRequestPersonAction());

const fetchPerson = (id) => async (dispatch, getState) => {
  try {

    const person = await fetchPersonAxios(id);
    const personAction = fetchPersonAction(person.data);
    dispatch(personAction);
  } catch (e) {
    dispatch(errorFecthingPersonAction('error loading person detail'));
  }
};


const updatePerson = (id, updatedPerson) => async (dispatch, getState) => {
    try {
        await updatePersonAxios(id,updatedPerson);
        dispatch(updatePersonAction());
    } catch (e) {
        dispatch(errorUpdatingPersonAction('error updating person detail'));
    }
};

const addNewPerson = (person) => async (dispatch, getState) => {
    try {
       const response= await addNewPersonAxios(person);
        dispatch( addNewPersonAction(types.ADD_OPREATION_TYPE));
        return response;
    } catch (e) {
        dispatch(errorAddingNewPersonAction('error adding new person'));
    }
};


const deletePerson = (id) => async (dispatch, getState) => {
    try {
        const person = await deletePersonAxios(id);
        dispatch(deletePersonAction());
    } catch (e) {
        dispatch(errorFecthingPersonAction('error loading person detail'));
    }
};

const prepareForm  = () => dispatch => dispatch(prepareFormAction());



export {
    initiateRequestPerson,
    fetchPerson,
    updatePerson,
    prepareForm,
    addNewPerson,
    deletePerson
};
