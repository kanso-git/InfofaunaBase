
import {isNullOrUndefined} from "util";
import _ from "lodash";
import {LOCAL_STORAGE_USER_KEY} from "./Types";


let currentUser;

const loadCurrentUserFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY));
};

const getCurrentUser =()=>{
    if(!currentUser){
        currentUser = loadCurrentUserFromLocalStorage();
    }
    return currentUser;
}


// currentUserHasPermission("mds:samples:update");
const currentUserHasPermission = (permission) =>{
    return (getCurrentUser() && _.indexOf(getCurrentUser().permissions, permission) != -1);
}

// currentUserHasRole("infofauna:manager");
const currentUserHasRole = (role) =>{
    if(getCurrentUser()){
        let filteredRole =getCurrentUser().roles.find((r)=>{
            return r['designation'] === role;
        })
        return !isNullOrUndefined(filteredRole);
    }else{
        return false;
    }
}

const currentUserHasInfofaunaUserPermission = () =>{
   return (currentUserHasPermission("infofauna:*") || currentUserHasPermission("infofauna:user"))

}

const currentUserHasInfofaunaManagerPermission = () =>{
    return currentUserHasPermission("infofauna:*")
}
export {
    loadCurrentUserFromLocalStorage,
    getCurrentUser,
    currentUserHasPermission,
    currentUserHasRole,
    currentUserHasInfofaunaUserPermission,
    currentUserHasInfofaunaManagerPermission
}