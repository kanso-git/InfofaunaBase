const ADD_INGREDIENT = 'ADD_INGREDIENT';
const REMOVE_INGREDIENT = 'REMOVE_INGREDIENT';
const LOAD_INITIAL_IINGREDIENTS = 'LOAD_INITIAL_IINGREDIENTS';
const ERROR_LOADING_INITIAL_IINGREDIENTS = 'ERROR_LOADING_INITIAL_IINGREDIENTS';

const PURCHASE_ORDER = 'PURCHASE_ORDER';
const CANCEL_ORDER = 'CANCEL_ORDER';
const LIST_ORDERS = 'LIST_ORDERS';
const ERROR_LOADING_LIST_ORDERS = 'ERROR_LOADING_LIST_ORDERS';

const PLACE_ORDER = 'PLACE_ORDER';
const ERROR_PLACING_ORDER = 'ERROR_PLACING_ORDER';
const INITIATE_ORDER_PURCHASE = 'INITIATE_ORDER_PURCHASE';
const END_ORDER_PURCHASE = 'END_ORDER_PURCHASE';
const INITIATE_FETCH_ORDERS = 'INITIATE_FETCH_ORDERS';

const INITIATE_LOGIN = 'INITIATE_LOGIN';
const LOGIN = 'LOGIN';
const ERROR_LOGIN = 'ERROR_LOGIN';
const LOGOUT = 'LOGOUT';
const ERROR_LOGOUT = 'ERROR_LOGOUT';
const LOCAL_STORAGE_USER_KEY = 'LOCAL_STORAGE_USER_KEY';
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const SET_ACTIVE_PATHNAME = 'SET_ACTIVE_PATHNAME';

// person
const INITIATE_FETCH_PERSON = 'INITIATE_FETCH_PERSON';
const FETCH_PERSON = 'FETCH_PERSON';
const ERROR_FECTHING_PERSON = 'ERROR_FECTHING_PERSON';

const ADD_PERSON = 'ADD_PERSON';
const UPDATE_PERSON = 'UPDATE_PERSON';
const DELETE_PERSON='DELETE_PRSON';
const ERROR_UPDATE_PERSON = 'ERROR_UPDATE_PERSON';
const ERROR_ADD_PERSON = 'ERROR_ADD_PERSON';
const PREPARE_PERSON_FORM_FOR_ADD ='PREPARE_PERSON_FORM_FOR_ADD';

// projects
const INITIATE_FETCH_PROJECT = 'INITIATE_FETCH_PROJECT';
const FETCH_PROJECT = 'FETCH_PROJECT';
const ERROR_FECTHING_PROJECT = 'ERROR_FECTHING_PROJECT';
const FETCH_PROJECTS_LIST = 'FETCH_PROJECTS_LIST';
const LOAD_ADDITIONAL_DATA_PROJECT='LOAD_ADDITIONAL_DATA_PROJECT';
const PREPARE_PROJECT_FORM_FOR_ADD ='PREPARE_PROJECT_FORM_FOR_ADD';

const ADD_PROJECT = 'ADD_PROJECT';
const UPDATE_PROJECT = 'UPDATE_PROJECT';
const ERROR_UPDATE_PROJECT = 'ERROR_UPDATE_PROJECT';
const ERROR_ADD_PROJECT = 'ERROR_ADD_PROJECT';
const DELETE_PROJECT='DELETE_PROJECT';


// THESAURUS
const INITIATE_FETCH_THESAURUS = 'INITIATE_FETCH_THESAURUS';
const FETCH_THESAURUS = 'FETCH_THESAURUS';
const ERROR_FECTHING_THESAURUS = 'ERROR_FECTHING_THESAURUS';

//REALMS code
const REALM_COUNTRY = 'COUNTRY';
const REALM_LANGUAGE = 'LANTRANSLATE';
const REALM_GENDER = 'GENDER';
const REALM_TITLE = 'TITLE';

const REALM_PROJETLIMA = 'PROJETLIMA'; // Limites d’accès aux données
const REALM_PROJETORIG = 'PROJETORIG'; // Origine (du financement) du projet (privé, public, recherche…)
const REALM_PROJETTYPE = 'PROJETTYPE'; //Types de projet
const REALM_FUNCTION = 'FUNCTION'; //Fonction des responsables

const INITIATE_FETCH_INSTITUTION = 'INITIATE_FETCH_INSTITUTION';
const FETCH_INSTITUTION = 'FETCH_INSTITUTION';
const ERROR_FECTHING_INSTITUTION = 'ERROR_FECTHING_INSTITUTION';

const ADD_INSTITUTION = 'ADD_INSTITUTION';
const UPDATE_INSTITUTION = 'UPDATE_INSTITUTION';
const DELETE_INSTITUTION='DELETE_INSTITUTION';
const ERROR_UPDATE_INSTITUTION = 'ERROR_UPDATE_INSTITUTION';
const ERROR_ADD_INSTITUTION = 'ERROR_ADD_INSTITUTION';
const PREPARE_INSTITUTION_FORM_FOR_ADD ='PREPARE_INSTITUTION_FORM_FOR_ADD';
const FETCH_INSTITUTION_PERSON_LIST= 'FETCH_INSTITUTION_PERSON_LIST';



const FETCH_OPREATION_TYPE ='FETCH_OPREATION_TYPE';
const ADD_OPREATION_TYPE ='ADD_OPREATION_TYPE';
const MODIFY_OPREATION_TYPE ='MODIFY_OPREATION_TYPE';
const DELETE_OPREATION_TYPE ='DELETE_OPREATION_TYPE';


export {
    ADD_INGREDIENT,
    REMOVE_INGREDIENT,
    LOAD_INITIAL_IINGREDIENTS,
    PURCHASE_ORDER,
    CANCEL_ORDER,
    LIST_ORDERS,
    PLACE_ORDER,
    ERROR_LOADING_INITIAL_IINGREDIENTS,
    ERROR_LOADING_LIST_ORDERS,
    ERROR_PLACING_ORDER,
    INITIATE_ORDER_PURCHASE,
    END_ORDER_PURCHASE,
    INITIATE_FETCH_ORDERS,
    INITIATE_LOGIN,
    LOGIN,
    ERROR_LOGIN,
    LOGOUT,
    ERROR_LOGOUT,
    LOCAL_STORAGE_USER_KEY,
    SET_CURRENT_USER,
    SET_ACTIVE_PATHNAME,
    INITIATE_FETCH_PERSON,
    FETCH_PERSON,
    ADD_PERSON,
    UPDATE_PERSON,
    ERROR_UPDATE_PERSON,
    ERROR_ADD_PERSON,
    ERROR_FECTHING_PERSON,
    INITIATE_FETCH_INSTITUTION,
    FETCH_INSTITUTION,
    ERROR_FECTHING_INSTITUTION,

    ADD_INSTITUTION,
    DELETE_INSTITUTION,
    UPDATE_INSTITUTION,
    ERROR_UPDATE_INSTITUTION,
    ERROR_ADD_INSTITUTION,
    PREPARE_INSTITUTION_FORM_FOR_ADD,
    FETCH_INSTITUTION_PERSON_LIST,

    INITIATE_FETCH_PROJECT,
    FETCH_PROJECT,
    ERROR_FECTHING_PROJECT,
    FETCH_PROJECTS_LIST,
    INITIATE_FETCH_THESAURUS,
    FETCH_THESAURUS,
    ERROR_FECTHING_THESAURUS,
    REALM_COUNTRY,
    REALM_GENDER,
    REALM_LANGUAGE,
    REALM_TITLE,
    REALM_PROJETLIMA,
    REALM_PROJETORIG,
    REALM_PROJETTYPE,
    REALM_FUNCTION,
    FETCH_OPREATION_TYPE,
    ADD_OPREATION_TYPE,
    MODIFY_OPREATION_TYPE,
    DELETE_OPREATION_TYPE,
    PREPARE_PERSON_FORM_FOR_ADD,
    PREPARE_PROJECT_FORM_FOR_ADD,
    ADD_PROJECT,
    DELETE_PROJECT,
    DELETE_PERSON,
    UPDATE_PROJECT,
    ERROR_UPDATE_PROJECT,
    ERROR_ADD_PROJECT,
    LOAD_ADDITIONAL_DATA_PROJECT
};
