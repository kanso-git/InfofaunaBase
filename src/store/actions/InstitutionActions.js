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


const fetchInstitutionPersonListAction = payload => ({
    type: types.FETCH_INSTITUTION_PERSON_LIST,
    payload
});

const errorFecthingInstitutionAction = payload => ({
  type: types.ERROR_FECTHING_INSTITUTION,
  payload
});


const prepareFormAction = () =>({
    type: types.PREPARE_INSTITUTION_FORM_FOR_ADD
})

const updateInstitutionAction =() => ({
    type: types.UPDATE_INSTITUTION,
    payload:types.MODIFY_OPREATION_TYPE
});

const addNewInstitutionAction = () => ({
    type: types.ADD_INSTITUTION,
    payload:types.ADD_OPREATION_TYPE
});

const deleteInstitutionAction =() => ({
    type: types.DELETE_INSTITUTION,
    payload:types.DELETE_OPREATION_TYPE
});


const errorUpdatingInstitutionAction = payload => ({
    type: types.ERROR_UPDATE_INSTITUTION,
    payload
});

const errorAddingNewInstitutionAction = payload => ({
    type: types.ERROR_ADD_INSTITUTION,
    payload
});


// axios
const fetchInstitutionAxios = async id => {
  const url = `/api/institutions/${id}`;
  // console.log(`fetchInstitutionAxios url:${url}`);
  return axios.get(url);
};

const fetchPersonsListAxios = async () => {
  const url = `/api/persons/list`;
    // console.log(`fetchPersonsListAxios url:${url}`);
  return axios.get(url);
};

// actions

const initiateFetchInstitution = () => dispatch =>
  dispatch(initiateFetchInstitutionAction());


const updateInstitutionAxios = async (id, updatedInstitution) => {
    const url =`/api/institutions/${id}`;
    // console.log(`updateInstitutionAxios url:${url} ,updatedInstitution:${JSON.stringify(updatedInstitution,null,3)} `);
    return axios.put(url,updatedInstitution);
};

const addNewInstitutionAxios = async (institution) => {
    const url =`/api/institutions/`;
    // console.log(`addNewInstitutionAxios url:${JSON.stringify(institution,null,3)}`);
    return axios.post(url,institution);
};


const deleteInstitutionAxios = (id) =>{
    const url =`/api/institutions/${id}`;
    // console.log(`deleteInstitutionAxios url:${url}`);
    return axios.delete(url);
}

const loadInstitutionPersonListData = ()=> async(dispatch, getState) => {
    try {
        let personsList = getState().institution.personsList;
        if (!personsList) {
            const personsListAxios = await fetchPersonsListAxios();
            personsList = personsListAxios.data;
        }

        const institutionPersonListAction = fetchInstitutionPersonListAction({
            personsList
        });
        dispatch(institutionPersonListAction);
    } catch (e) {
        dispatch(errorFecthingInstitutionAction('error Institution person detail'));
    }
};

const fetchInstitution = id => async (dispatch, getState) => {
  try {

    const institution = await fetchInstitutionAxios(id);
    const institutionAction = fetchInstitutionAction({
      institution: institution.data
    });
    dispatch(institutionAction);
  } catch (e) {
    dispatch(errorFecthingInstitutionAction('error Institution person detail'));
  }
};

const updateInstitution = (id, updatedInstitution) => async (dispatch, getState) => {
    try {
        await updateInstitutionAxios(id,updatedInstitution);
        dispatch(updateInstitutionAction());
    } catch (e) {
        dispatch(errorUpdatingInstitutionAction('error updating Institution detail'));
    }
};

const addNewInstitution = (person) => async (dispatch, getState) => {
    try {
        const response= await addNewInstitutionAxios(person);
        dispatch( addNewInstitutionAction(types.ADD_OPREATION_TYPE));
        return response;
    } catch (e) {
        dispatch(errorAddingNewInstitutionAction('error adding new person'));
    }
};


const deleteInstitution = (id) => async (dispatch, getState) => {
    try {
        const institution = await deleteInstitutionAxios(id);
        dispatch(deleteInstitutionAction());
    } catch (e) {
        dispatch(errorFecthingInstitutionAction('error loading Institution detail'));
    }
};

const prepareForm  = () => dispatch => dispatch(prepareFormAction());

export {
     initiateFetchInstitution,
     fetchInstitution,
     loadInstitutionPersonListData,
     updateInstitution,
     prepareForm,
     addNewInstitution,
     deleteInstitution
};
