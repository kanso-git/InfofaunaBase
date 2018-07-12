import axios from '../../axios-infofauna';
import * as types from './Types';
import * as authHelper from './AuthHelper';
// actions generators
const initiateFetchUserAction = () => ({
  type: types.INITIATE_FETCH_USER
});

const fetchUserAction = payload => ({
  type: types.FETCH_USER,
  payload
});

const fetchUserAdditionalDataListAction = payload => ({
  type: types.FETCH_USER_ADDITIONAL_DATA_LIST,
  payload
});

const errorFecthingUserAction = payload => ({
  type: types.ERROR_FECTHING_USER,
  payload
});

const prepareFormAction = () => ({
  type: types.PREPARE_USER_FORM_FOR_ADD
});

const updateUserAction = () => ({
  type: types.UPDATE_USER,
  payload: types.MODIFY_OPREATION_TYPE
});

const addNewUserAction = () => ({
  type: types.ADD_USER,
  payload: types.ADD_OPREATION_TYPE
});

const deleteUserAction = () => ({
  type: types.DELETE_USER,
  payload: types.DELETE_OPREATION_TYPE
});

const errorUpdatingUserAction = payload => ({
  type: types.ERROR_UPDATE_USER,
  payload
});

const errorAddingNewUserAction = payload => ({
  type: types.ERROR_ADD_USER,
  payload
});

const fetchUserRolesAndGroupsAction = payload => ({
  type: types.FETCH_USER_ROLES_AND_GROUPS,
  payload
});

// axios
const fetchUserAxios = async id => {
  const url = `/api/users/${id}`;
    // console.log(`fetchUserAxios url:${url}`);
  return axios.get(url);
};

const fetchPersonsListAxios = async () => {
  const url = `/api/persons/list`;
    // console.log(`fetchPersonsListAxios url:${url}`);
  return axios.get(url);
};

const fetchLanguageListAxios = async () => {
  const url = `/api/languages`;
  console.log(`fetchLanguageListAxios url:${url}`);
  return axios.get(url);
};

const fetchGroupListAxios = async () => {
  const url = `/api/groups/list`;
  console.log(`fetchGroupListAxios url:${url}`);
  return axios.get(url);
};

const fetchRoleListAxios = async () => {
  const url = `/api/roles/list`;
  console.log(`fetchRoleListAxios url:${url}`);
  return axios.get(url);
};

// actions

const initiateFetchUser = () => dispatch => dispatch(initiateFetchUserAction());

const updateUserAxios = async (id, updatedUser) => {
  const url = `/api/users/${id}`;
  console.log(
    `updateUserAxios url:${url} ,updatedUser:${JSON.stringify(
      updatedUser,
      null,
      3
    )} `
  );
  return axios.put(url, updatedUser);
};

const addNewUserAxios = async user => {
  const url = `/api/users/`;
  console.log(`addNewUserAxios url:${JSON.stringify(user, null, 3)}`);
  return axios.post(url, user);
};

const deleteUserAxios = id => {
  const url = `/api/users/${id}`;
  console.log(`deleteUserAxios url:${url}`);
  return axios.delete(url);
};

const loadUserAdditionalListData = () => async (dispatch, getState) => {
  try {
    let personsList = getState().user.personsList;
    if (!personsList) {
      const personsListAxios = await fetchPersonsListAxios();
      personsList = personsListAxios.data;
    }

    let languagesList = getState().user.languagesList;
    if (!languagesList) {
      const languagesListAxios = await fetchLanguageListAxios();
      languagesList = languagesListAxios.data;
    }

    const loadUserAdditionalListDataAction = fetchUserAdditionalDataListAction({
      personsList,
      languagesList
    });
    dispatch(loadUserAdditionalListDataAction);
  } catch (e) {
    dispatch(errorFecthingUserAction('error User person detail'));
  }
};

const loadRolesAndGroupsData = userId => async (dispatch, getState) => {
  try {
        let roleList = getState().user.roles;
        let userData = getState().user.data;
        let enableDelete = false;

        try {
          const roleListAxios = await fetchRoleListAxios();


          // manage the export role inside the user role
          /*
              roleList = roleListAxios.data.filter(
                  g => g.name.indexOf('EXPORT') === -1
              );
          */
           roleList = roleListAxios.data;

          if (authHelper.currentUserHasInfofaunaManagerPermission()) {

            // case : view or modify existing user
            if (userId) {

              const userDataHasInfofaunaManagerRole = userData.permissions.findIndex(p =>p.endsWith('infofauna:manager'));
              if (userDataHasInfofaunaManagerRole !== -1) {
                // currentUser InfofaunaManagerRole =>  dataUser InfofaunaManagerRole
                // view or modify my his owen user or another user (user has infofauna:manager role)
                // current connected user (infofauna:manager) can only add or remove user rights expect for infofauna.

                roleList = roleList.map(r => ({
                  ...r,
                  readOnlyAndSelected: (r.application.code.toLowerCase() === 'infofauna' || r.name.toLowerCase() === 'manager')
                }));

                  // currentUser profile = dataUser profile
                  enableDelete = false;
              } else {
                // currentUser InfofaunaManagerRole =>  dataUser doesn't have InfofaunaManagerRole
                // view or modify another user (user doesn't have infofauna:manager role)
                // current connected user (user has infofauna:manager role) can add/remove any role except you can't add infofauna:manager role

                  roleList = roleList.map(r => ({
                      ...r,
                      readOnly:  (r.application.code + ':' + r.name).toLowerCase() ===  'infofauna:manager'
                  }));

                  // currentUser profile > data user profile
                  enableDelete = true;

              }
            } else {
              // case : add new , can give all roles to the new created user  except infofauna manager role
                roleList = roleList.map(r => ({
                    ...r,
                    readOnly:  (r.application.code + ':' + r.name).toLowerCase() ===  'infofauna:manager'
                }));
            }
          } else if (authHelper.currentUserManagerPermissionsArray().length > 0) {

            // case : view or modify existing user ( e.g logged user with mds manager role )
            if (userId) {

                const userDataHasInfofaunaManagerRole = userData.permissions.findIndex(p =>p.endsWith('infofauna:manager'));

                if(userDataHasInfofaunaManagerRole !== -1){
                    // currentUser has AppManagerRole =>  dataUser InfofaunaManagerRole
                    // view or modify  another user (another user has infofauna:manager role)
                    roleList = roleList.map(r => ({
                        ...r,
                        readOnlyAndSelected: (r.application.code.toLowerCase() === 'infofauna' || r.name.toLowerCase() === 'manager')
                    }));
                    // current connected user (app:manager ) can only add/remove  user rights for the app manager he owens
                    roleList = roleList.map(r=>{
                      if( r.name.toLowerCase() === "user"){
                        if(authHelper.currentUserManagerPermissionsArray().indexOf((r.application.code + ':manager').toLowerCase()) !== -1){
                          return r; // he can add this role since he has the manager of this user
                        }else{
                          // add readOnly flag since he dosen't have the manager of this user
                          return {
                              ...r,
                              readOnly: true
                          }
                        }
                      }else{
                        return r ; // since the manager is already flagged with readOnlyAndSelected
                      }
                    });

                    // currentUser  profile < data user profile
                    enableDelete = false;
                }else {
                    // currentUser has AppManagerRole =>  dataUser has AppManagerRole or AppUserRole
                    // view or modify its user or another user (user doesn't have infofauna:manager role)
                    // current connected user (user has app:manager role) can add/remove user roles for the app manager he owens

                     // 1. enables apps where current user is not a manager on them
                      roleList = roleList.map(r=>{
                          if( r.name.toLowerCase() === "user"){
                              if(authHelper.currentUserManagerPermissionsArray().indexOf((r.application.code + ':manager').toLowerCase()) !== -1){
                                  return r; // he can add this role since he has the manager of this user
                              }else{
                                  // add readOnly flag since he dosen't have the manager of this user
                                  return {
                                      ...r,
                                      readOnly: true
                                  }
                              }
                          }else{
                              return {
                                  ...r,
                                  readOnly: true
                              };
                          }
                      });

                      // check if dataUser has an appManager role
                      const userDataAppManagerRoleList = userData.permissions.filter(p =>p.endsWith(':manager'));
                      if(userDataAppManagerRoleList.length>0){
                          // currentUser  profile == data user profile
                          enableDelete = false;
                      }else{
                          // currentUser  profile > data user profile
                          enableDelete = true;
                      }
                }
            } else {
              // case add new user.
                // currentUser has AppManagerRole => currentUser can creates
                roleList = roleList.map(r=>{
                    if( r.name.toLowerCase() === "user"){
                        if(authHelper.currentUserManagerPermissionsArray().indexOf((r.application.code + ':manager').toLowerCase()) !== -1){
                            return r; // he can add this role since he has the manager of this user
                        }else{
                            // add readOnly flag since he dosen't have the manager of this user
                            return {
                                ...r,
                                readOnly: true
                            }
                        }
                    }else{
                        // since the manager is already flagged with readOnly
                        return {
                            ...r,
                            readOnly: true
                        };
                    }
                });

            }
          } else {
              // currentUser is an infofaunaUser =>  can't add or modify
              if (userId) {

                  const userDataHasInfofaunaManagerRole = userData.permissions.findIndex(p =>p.endsWith('infofauna:manager'));
                  if (userDataHasInfofaunaManagerRole !== -1) {
                      // currentUser is an infofaunaUser =>  dataUser InfofaunaManagerRole
                      roleList = roleList.map(r => ({
                          ...r,
                          readOnlyAndSelected: (r.application.code.toLowerCase() === 'infofauna' || r.name.toLowerCase() === 'manager'),
                          readOnly: true
                      }));

                  } else {
                      // currentUser is an infofaunaUser =>  dataUser doesn't have InfofaunaManagerRole
                      roleList = roleList.map(r=>({
                          ...r,
                          readOnly: true
                      }));
                  }
              }else{
                  roleList = roleList.map(r=>({
                      ...r,
                      readOnly: true
                  }));
              }
              enableDelete = false;
          }
        } catch (e) {
          console.log('loadRolesAndGroupsData error in getting the roleList');
          console.log(e);
          roleList = [];
        }

        console.log(" roleList after >>>>>>>>>>");
        console.log(JSON.stringify(roleList,null,3));
    let groupList = getState().user.groups;
    if (!groupList) {
      try {
        const groupListAxios = await fetchGroupListAxios();
        groupList = groupListAxios.data.filter(g => g.name !== 'PUBLIC');
      } catch (e) {
        console.log('loadRolesAndGroupsData error in getting the groupList');
        console.log(e);
        groupList = [];
      }
    }
    const userRolesAndGroupsAction = fetchUserRolesAndGroupsAction({
      roles: roleList,
      groups: groupList,
      enableDelete: enableDelete
    });
    dispatch(userRolesAndGroupsAction);
  } catch (e) {
    dispatch(errorFecthingUserAction('error in getting roles and groups'));
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
    await updateUserAxios(id, updatedUser);
    dispatch(updateUserAction());
  } catch (e) {
    dispatch(errorUpdatingUserAction('error updating User detail'));
  }
};

const addNewUser = person => async (dispatch, getState) => {
  try {
    const response = await addNewUserAxios(person);
    dispatch(addNewUserAction(types.ADD_OPREATION_TYPE));
    return response;
  } catch (e) {
    dispatch(errorAddingNewUserAction('error adding new person'));
  }
};

const deleteUser = id => async (dispatch, getState) => {
  try {
    const user = await deleteUserAxios(id);
    dispatch(deleteUserAction());
  } catch (e) {
    dispatch(errorFecthingUserAction('error loading User detail'));
  }
};

const prepareForm = () => dispatch => dispatch(prepareFormAction());

export {
  initiateFetchUser,
  fetchUser,
  loadUserAdditionalListData,
  updateUser,
  prepareForm,
  addNewUser,
  deleteUser,
  loadRolesAndGroupsData
};
