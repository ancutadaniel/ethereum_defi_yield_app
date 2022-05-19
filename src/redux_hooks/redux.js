import * as ACTIONS from './constants';

export const reducer = (state, action) => {
  const {
    SET_WEB3,
    SET_ERROR,
    SET_AMOUNT,
    SET_LOADING,
    SET_STAKING,
    SET_RELOAD_DATA,
  } = ACTIONS;
  console.log(action.type, action.value);

  switch (action.type) {
    case SET_WEB3:
      return {
        ...state,
        ...action.value,
      };

    case SET_AMOUNT:
      return {
        ...state,
        amount: action.value,
      };

    case SET_STAKING:
      return {
        ...state,
        amount: 0,
        reloadData: true,
        loading: false,
      };

    case SET_RELOAD_DATA:
      return {
        ...state,
        reloadData: true,
        loading: true,
      };

    case SET_ERROR:
      return {
        ...state,
        errors: action.value,
        loading: false,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };

    default:
      return {
        ...state,
      };
  }
};
