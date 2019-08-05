export default {
  FETCH_LANGUAGES_STARTED: state => ({ ...state, isLoading: true }),
  FETCH_LANGUAGES_ENDED: state => ({ ...state, isLoading: false }),
  FETCH_LANGUAGES_SUCCEEDED: (state, { payload }) => ({
    ...state,
    languages: {
      data: payload,
      status: 'success'
    }
  }),
  FETCH_LANGUAGES_FAILED: state => ({
    ...state,
    languages: {
      errors: [{ title: 'Something was wrong.' }],
      status: 'error'
    }
  }),
  SET_CURRENT_LANGUAGE: (state, { payload }) => ({
    ...state,
    languages: {
      current: payload
    }
  }),
  TOGGLE_IS_OPEN_LANGUAGE: (state, { payload }) => ({
    ...state,
    languages: {
      isOpen: payload
    }
  })
};
