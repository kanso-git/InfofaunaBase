import * as types from '../actions/Types';

const initialState = {
    startLogin: false,
    error: null,
    user: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.INITIATE_LOGIN:
            return {...state, startLogin: true};
        case types.ERROR_LOGIN:
            return {...state, error: action.payload, startLogin: false};

        case types.LOGIN:
        case types.SET_CURRENT_USER:
            return {
                ...state,
                user: action.payload,
                error: null,
                startLogin: false
            };

        case types.LOGOUT:
            return {...initialState};

        case types.ERROR_LOGOUT:
            return {...initialState, error: action.payload};

        default:
            return state;
    }
};

export default authReducer;
