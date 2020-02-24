import { createAction, createActionThunk } from 'vizzuality-redux-tools';

import { exists } from 'utils/functions';

export const fetchLanguages = createActionThunk(
  'FETCH_LANGUAGES',
  () => new Promise((resolve, reject) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && exists(window.Transifex)) {
      Transifex.live.onError(err => reject(err));
      Transifex.live.onFetchLanguages(languages => resolve(languages));
      Transifex.live.getAllLanguages();
    }
  })
);

export const setCurrentLanguage = createAction('SET_CURRENT_LANGUAGE');
