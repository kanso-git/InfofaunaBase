import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators
const initiateFetchUserAction = () => ({
  type: types.INITIATE_FETCH_USER
});

const fetchUserAction = payload => ({
  type: types.FETCH_USER,
  payload
});


const fetchUserPersonListAction = payload => ({
    type: types.FETCH_USER_PERSON_LIST,
    payload
});

const errorFecthingUserAction = payload => ({
  type: types.ERROR_FECTHING_USER,
  payload
});


const prepareFormAction = () =>({
    type: types.PREPARE_USER_FORM_FOR_ADD
})

const updateUserAction =() => ({
    type: types.UPDATE_USER,
    payload:types.MODIFY_OPREATION_TYPE
});

const addNewUserAction = () => ({
    type: types.ADD_USER,
    payload:types.ADD_OPREATION_TYPE
});

const deleteUserAction =() => ({
    type: types.DELETE_USER,
    payload:types.DELETE_OPREATION_TYPE
});


const errorUpdatingUserAction = payload => ({
    type: types.ERROR_UPDATE_USER,
    payload
});

const errorAddingNewUserAction = payload => ({
    type: types.ERROR_ADD_USER,
    payload
});


// axios
const fetchUserAxios = async id => {
  const url = `/api/users/${id}`;
  console.log(`fetchUserAxios url:${url}`);
  return axios.get(url);
};

const fetchPersonsListAxios = async () => {
  const url = `/api/persons/list`;
  console.log(`fetchPersonsListAxios url:${url}`);
  return axios.get(url);
};

// actions

const initiateFetchUser = () => dispatch =>
  dispatch(initiateFetchUserAction());


const updateUserAxios = async (id, updatedUser) => {
    const url =`/api/users/${id}`;
    console.log(`updateUserAxios url:${url} ,updatedUser:${JSON.stringify(updatedUser,null,3)} `);
    return axios.put(url,updatedUser);
};

const addNewUserAxios = async (user) => {
    const url =`/api/users/`;
    console.log(`addNewUserAxios url:${JSON.stringify(user,null,3)}`);
    return axios.post(url,user);
};


const deleteUserAxios = (id) =>{
    const url =`/api/users/${id}`;
    console.log(`deleteUserAxios url:${url}`);
    return axios.delete(url);
}

const loadUserPersonListData = ()=> async(dispatch, getState) => {
    try {
        let personsList = getState().user.personsList;
        if (!personsList) {
            const personsListAxios = await fetchPersonsListAxios();
            personsList = personsListAxios.data;
        }

        const userPersonListAction = fetchUserPersonListAction({
            personsList
        });
        dispatch(userPersonListAction);
    } catch (e) {
        dispatch(errorFecthingUserAction('error User person detail'));
    }
};

const fetchUser = id => async (dispatch, getState) => {
  try {

    const user = await fetchUserAxios(id);
    const userAction = fetchUserAction({
      user: user.data
    });
    dispatch(userAction);
  } catch (e) {
    dispatch(errorFecthingUserAction('error User person detail'));
  }
};

const updateUser = (id, updatedUser) => async (dispatch, getState) => {
    try {
        await updateUserAxios(id,updatedUser);
        dispatch(updateUserAction());
    } catch (e) {
        dispatch(errorUpdatingUserAction('error updating User detail'));
    }
};

const addNewUser = (person) => async (dispatch, getState) => {
    try {
        const response= await addNewUserAxios(person);
        dispatch( addNewUserAction(types.ADD_OPREATION_TYPE));
        return response;
    } catch (e) {
        dispatch(errorAddingNewUserAction('error adding new person'));
    }
};


const deleteUser = (id) => async (dispatch, getState) => {
    try {
        const user = await deleteUserAxios(id);
        dispatch(deleteUserAction());
    } catch (e) {
        dispatch(errorFecthingUserAction('error loading User detail'));
    }
};

const prepareForm  = () => dispatch => dispatch(prepareFormAction());

export {
     initiateFetchUser,
     fetchUser,
     loadUserPersonListData,
     updateUser,
     prepareForm,
     addNewUser,
     deleteUser
};
