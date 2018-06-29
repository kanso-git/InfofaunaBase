import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import projectReducer from './ProjectReducer';
import personReducer from './PersonReducer';
import thesaurusReducer from './ThesaurusReducer';
import institutionReducer from './InstitutionReducer';
import userReducer from "./userReducer";

export default combineReducers({
  auth: authReducer,
  project: projectReducer,
  person: personReducer,
  thesaurus: thesaurusReducer,
  institution: institutionReducer,
  user:userReducer
});
