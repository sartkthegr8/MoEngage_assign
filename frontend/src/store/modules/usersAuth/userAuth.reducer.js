import {USER_LOGIN, USER_SIGNUP, USER_LOGOUT} from './userAuth.types';

const initial = {
  user: {},
};

const UserReducer = function (state = initial, action) {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, user: action.payload };
    case USER_LOGOUT:
      return { ...state, user: action.payload };
    case USER_SIGNUP:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default UserReducer;
