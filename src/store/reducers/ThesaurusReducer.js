import * as types from '../actions/Types';

const initialState = {

};
//  const payload= {thesaurusCode:code,data:thesaurus.data};
const thesaurusReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.FETCH_THESAURUS:
            return {
                ...state,
                [action.payload.thesaurusCode]: action.payload.data
            };

        default:
            return state;
    }
};

export default thesaurusReducer;
