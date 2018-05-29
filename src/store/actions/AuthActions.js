import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators

const initiateLoginAction = () => ({
  type: types.INITIATE_LOGIN
});

const errorLogingAction = () => ({
  type: types.ERROR_LOGIN
});

const loginAction = payload => ({
  type: types.LOGIN,
  payload
});

const logoutAction = payload => ({
  type: types.LOGOUT,
  payload
});

const errorLogoutAction = payload => ({
  type: types.ERROR_LOGOUT,
  payload
});

const setCurrentUserAction = payload =>({
    type: types.SET_CURRENT_USER,
    payload
})

// axios
const loginAxios = async (user) => {
  console.log(`loginAxios user:${JSON.stringify(user,null,3)}`);
  return axios.post('api/sessions', user);
};

const logoutAxios = async orderData => {
  return axios.delete('api/sessions/current', orderData);
};


// actions
const initiateLogin = () => dispatch => dispatch(initiateLoginAction());


const login = payload => async (dispatch, getState) => {
  try {
      const user={...payload, clientDomain:window.location.hostname.split('.').slice(-2).join('.')};
      console.log(`login user:${JSON.stringify(user,null,3)}`)
      const userResponse = await loginAxios(user);
      localStorage.setItem(types.LOCAL_STORAGE_USER_KEY, JSON.stringify(userResponse.data));
      dispatch(loginAction(userResponse.data));
  } catch (e) {
    dispatch(errorLogingAction('login error'));
  }
};

const logout = payload => async (dispatch, getState) => {
  try {
        localStorage.removeItem(types.LOCAL_STORAGE_USER_KEY);
        const loginAxios = await logoutAction({clientDomain:window.location.hostname.split('.').slice(-2).join('.')});
        dispatch(logoutAction());
  } catch (e) {
    dispatch(errorLogoutAction('error placing order'));
  }
};

const setCurrentUser = (user) => dispatch => dispatch(setCurrentUserAction(user));

export { initiateLogin, login, logout, setCurrentUser };
