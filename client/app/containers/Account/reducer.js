/*
 *
 * Account reducer
 *
 */

import {
  ACCOUNT_CHANGE,
  FETCH_PROFILE,
  TOGGLE_RESET_FORM,
  CLEAR_ACCOUNT
} from './constants';

const initialState = {
  user: {
    firstName: '',
    address : '',
    zipcode: ''
  },
  isFormOpen: false
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNT_CHANGE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case FETCH_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case TOGGLE_RESET_FORM:
      return {
        ...state,
        isFormOpen: !state.isFormOpen
      };
    case CLEAR_ACCOUNT:
      return {
        ...state,
        user: {
          firstName: '',
          address: '',
          zipcode: ''
        }
      };
    default:
      return state;
  }
};

export default accountReducer;
