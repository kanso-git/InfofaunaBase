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
  console.log(`fetchUserAxios url:${url}`);
  return axios.get(url);
};

const fetchPersonsListAxios = async () => {
  const url = `/api/persons/list`;
  console.log(`fetchPersonsListAxios url:${url}`);
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

    try {
      const roleListAxios = await fetchRoleListAxios();
      // manage the export role inside the user role
      roleList = roleListAxios.data.filter(
        g => g.name.indexOf('EXPORT') === -1
      );

      const currentUser = authHelper.getCurrentUser(); //logged user
      const currentUserManagerRoles = currentUser.permissions.filter(
        p => p.indexOf(':manager') !== -1
      );

      if (authHelper.currentUserHasInfofaunaManagerPermission()) {
        // case : view or modify existing user
        if (userId) {
          const userDataManagerRoles = userData.permissions.filter(
            p => p.indexOf(':manager') !== -1
          );
          const userDataHasInfofaunaManagerRole =
            userDataManagerRoles.indexOf('infofauna:manager') !== -1
              ? true
              : false;

          if (userDataHasInfofaunaManagerRole) {
            // view or modify my owen user or another user (user has infofauna:manager role)
            // i can only add or remove  rights for none infofauna app user.
            roleList = roleList.map(r => ({
              ...r,
              owned:
                r.application.code.toLowerCase() === 'infofauna'
                  ? true
                  : r.name.toLowerCase() === 'manager'
                    ? true
                    : false
            }));
          } else {
            // view or modify another user (user doesn't have infofauna:manager role)
            // you can add/remove any role except you can't add infofauna:manager role
            roleList = roleList.filter(
              r =>
                (r.application.code + ':' + r.name).toLowerCase() !==
                'infofauna:manager'
            );
          }
        } else {
          // case : add new , can add all except infofauna manager
          roleList = roleList.filter(
            r =>
              (r.application.code + ':' + r.name).toLowerCase() !==
              'infofauna:manager'
          );
        }
      } else if (
        !authHelper.currentUserHasInfofaunaManagerPermission() &&
        currentUserManagerRoles.length > 0
      ) {
        // case : view or modify existing user
        if (userId) {
        } else {
          // case add new ; we can only add users with the user profile
          // filter out infofauna:* and all the manager roles on the other apps
        }
      } else {
        // it's a normal user without any manager role, so it should not have any access to modify only read
      }

      /*

                // modify case : user exist
                if(userId){
                    if(currentUser.userId == userId){
                     // view my user

                        if(userDataManagerRoles.length>0){
                            if(userDataHasInfofaunaManagerRole){
                                roleList = roleList.map(r => ({
                                    ...r,
                                    readOnly: (r.application.code+":"+r.name).toLowerCase() === "infofauna:manager"
                                }))
                            }else{
                                roleList = roleList.map(r => ({
                                    ...r,
                                    readOnly: userDataManagerRoles.indexOf((r.application.code+":"+r.name).toLowerCase()) !== -1
                                }))
                            }

                        }else{
                            // no manager roles
                            roleList = roleList.map(r => ({
                                ...r,
                                readOnly:  authHelper.currentUserHasPermission((r.application.code+":"+r.name).toLowerCase())

                            }))
                        }
                        if(authHelper.currentUserHasInfofaunaManagerPermission()){
                            roleList = roleList.filter(r => {
                                const appRole = (r.application.code+":"+r.name).toLowerCase();
                                return  authHelper.currentUserHasPermission(appRole)
                            });
                        }else{

                        }

                    }else{
                        // view another user
                        if(authHelper.currentUserHasInfofaunaManagerPermission()){
                            roleList = roleList.filter(r => {
                                const appRole = (r.application.code+":"+r.name).toLowerCase();
                                return  authHelper.currentUserHasPermission(appRole)
                            });

                        }else {
                            roleList = roleList.filter(r => {
                                const userSlectedRole = userData.roleGroups.findIndex(up => up.roleId === r.id);
                                return userSlectedRole !== -1 ;
                            });
                        }

                    }
                }else {

                }
*/
    } catch (e) {
      console.log('loadRolesAndGroupsData error in getting the roleList');
      console.log(e);
      roleList = [];
    }

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
      groups: groupList
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
