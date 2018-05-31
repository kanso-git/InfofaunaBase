import axios from '../../axios-infofauna';
import * as types from './Types';

// actions generators
const fetchThesaurusAction = payload => ({
    type: types.FETCH_THESAURUS,
    payload
});

// axios
const fetchThesaurusAxios = async (code) => {
    const url =`/api/thesaurus/list/?code=${code}`;
    console.log(`fetchThesaurusAxios url:${url}`);
    return axios.get(url);
};


// actions
const fetchThesaurus = (code) => async (dispatch, getState) => {
    try {

        const thesaurus = await fetchThesaurusAxios(code);
        const payload= {thesaurusCode:code,data:thesaurus.data};
        const thesaurusAction = fetchThesaurusAction(payload);
        dispatch(thesaurusAction);
    } catch (e) {
       console.error(`error loading the thesaurus ${code}`);
    }
};

export {
    fetchThesaurus
};
