import { createAction, createActionThunk } from 'vizzuality-redux-tools';

export const fetchLanguages = createActionThunk(
  'FETCH_LANGUAGES',
  () => new Promise((resolve, reject) => {
    Transifex.live.onError(err => reject(err));
    Transifex.live.onFetchLanguages(languages => resolve(languages));
    Transifex.live.getAllLanguages();
  })
);

export const setCurrentLanguage = createAction('SET_CURRENT_LANGUAGE');
