import {isNullOrUndefined} from 'util';
import _ from 'lodash';
import {LOCAL_STORAGE_USER_KEY} from './Types';
import * as types from "./Types";

let currentUser;

const loadCurrentUserFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY));
};

const getCurrentUser = () => {
    currentUser = loadCurrentUserFromLocalStorage();
    return currentUser;
};

// currentUserHasPermission("mds:samples:update");
const currentUserHasPermission = permission => {
    return (
        getCurrentUser() &&
        _.indexOf(getCurrentUser().permissions, permission) != -1
    );
};

// currentUserHasRole("infofauna:manager");
const currentUserHasRole = role => {
    if (getCurrentUser()) {
        let filteredRole = getCurrentUser().roles.find(r => {
            return r['designation'] === role;
        });
        return !isNullOrUndefined(filteredRole);
    } else {
        return false;
    }
};

const currentUserHasInfofaunaUserPermission = () => {
    return (
        currentUserHasPermission('infofauna:manager') ||
        currentUserHasPermission('infofauna:user')
    );
};

const currentUserHasInfofaunaManagerPermission = () => {
    return currentUserHasPermission('infofauna:manager');
};

const currentUserManagerPermissionsArray = () => {
    let filteredManagerPermissions = [];
    if (getCurrentUser()) {
        filteredManagerPermissions = getCurrentUser().permissions.filter(
            p => p.endsWith(':manager')
        );
    }
    return filteredManagerPermissions;
};

const currentUserHasMidatManagerPermission = () => {
    return currentUserHasPermission('midat:manager');
};



const  getCookieKeys = () =>
{
   // Separate key  value pairs
    let cookies = document.cookie.split(";"),
        index, keys = [];
    for(let i = 0; i < cookies.length; i++) {
        const cookieEntry = cookies[i].split("=");
        //first part of the split string holds the key ...
        keys.push(cookieEntry[0]);
    }
    return keys;
}

const cleanLocalStorageAndDocumentCookie = ()=>{
    try{
        localStorage.removeItem(types.LOCAL_STORAGE_USER_KEY);
        const cookieKeys = getCookieKeys();

        for(let i = 0; i < cookieKeys.length; i++) {
            console.log(cookieKeys[i]);
           // document.cookie = cookieKeys[i]+'=; expires=Thu, 2 Aug 2001 20:47:11 UTC; path='
        }

    }catch (e) {
        debugger;
    }
}
export {
    loadCurrentUserFromLocalStorage,
    getCurrentUser,
    currentUserHasPermission,
    currentUserHasRole,
    currentUserHasInfofaunaUserPermission,
    currentUserHasInfofaunaManagerPermission,
    currentUserManagerPermissionsArray,
    cleanLocalStorageAndDocumentCookie

};
