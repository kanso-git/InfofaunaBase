import {combineReducers} from 'redux';
import burgerReducer from './BurgerReducer';
import orderReducer from './OrderReducer';
import authReducer from './AuthReducer';
import projectReducer from './ProjectReducer';
import personReducer from "./PersonReducer";
import thesaurusReducer from "./ThesaurusReducer";

export default combineReducers({
    burger: burgerReducer,
    order: orderReducer,
    auth: authReducer,
    project: projectReducer,
    person: personReducer,
    thesaurus: thesaurusReducer
});
