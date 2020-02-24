export default {
  FETCH_LANGUAGES_STARTED: state => ({ ...state, isLoading: true }),
  FETCH_LANGUAGES_ENDED: state => ({ ...state, isLoading: false }),
  FETCH_LANGUAGES_SUCCEEDED: (state, { payload }) => ({
    ...state,
    data: payload,
    status: 'success',
  }),
  FETCH_LANGUAGES_FAILED: state => ({
    ...state,
    errors: [{ title: 'Something went wrong.' }],
    status: 'error',
  }),
  SET_CURRENT_LANGUAGE: (state, { payload }) => ({
    ...state,
    current: payload
  }),
};
