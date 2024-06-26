import { sessionService } from "redux-react-session";

export function logoutUser(navigate) {
    sessionService.deleteSession();
    sessionService.deleteUser();
    navigate && navigate();
  }