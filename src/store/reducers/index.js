import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import projectReducer from './ProjectReducer';
import personReducer from './PersonReducer';
import thesaurusReducer from './ThesaurusReducer';

export default combineReducers({
  auth: authReducer,
  project: projectReducer,
  person: personReducer,
  thesaurus: thesaurusReducer
});
