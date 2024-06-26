import { combineReducers } from "redux";

import userAuth from "store/modules/usersAuth/userAuth.reducer";
import { sessionReducer } from "redux-react-session";

export default combineReducers({
  session: sessionReducer,
  userAuth,
});
