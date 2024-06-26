import {
  USER_LOGIN,
  USER_SIGNUP,
  USER_FORGOT_PASSWORD,
  USER_RESET_PASSWORD,
} from "./userAuth.types";
import { newRequest } from "helper/api";

export function login(data) {
  return async (dispatch) => {
    const requestObject = {
      method: "POST",
      url: "/user/signin",
      data: data,
    };

    try {
      // Make the API request using newRequest and get the response
      const response = await newRequest(requestObject);

      // Dispatch a success action with the response data
      return dispatch({ type: USER_LOGIN, ...response.data });
    } catch (error) {
      // Dispatch a failure action with the error
      return dispatch({ type: USER_LOGIN, ...error });
    }
  };
}

export function forgotPassword(data) {
  return async (dispatch) => {
    const requestObject = {
      method: "POST",
      url: "/user/request/reset/password",
      data: data,
    };

    try {
      // Make the API request using newRequest and get the response
      const response = await newRequest(requestObject);

      // Dispatch a success action with the response data
      return dispatch({ type: USER_FORGOT_PASSWORD, ...response.data });
    } catch (error) {
      // Dispatch a failure action with the error
      return dispatch({ type: USER_FORGOT_PASSWORD, ...error });
    }
  };
}

export function resetPassword(data) {
  return async (dispatch) => {
    const requestObject = {
      method: "POST",
      url: "/user/reset/password",
      data: data,
    };

    try {
      // Make the API request using newRequest and get the response
      const response = await newRequest(requestObject);

      // Dispatch a success action with the response data
      return dispatch({ type: USER_RESET_PASSWORD, ...response.data });
    } catch (error) {
      // Dispatch a failure action with the error
      return dispatch({ type: USER_RESET_PASSWORD, ...error });
    }
  };
}

export function register(data) {
  return async (dispatch) => {
    const requestObject = {
      method: "POST",
      url: "/user/signup",
      data: data,
    };

    try {
      // Make the API request using newRequest and get the response
      const response = await newRequest(requestObject);

      // Dispatch a success action with the response data
      return dispatch({ type: USER_SIGNUP, ...response.data });
    } catch (error) {
      // Dispatch a failure action with the error
      return dispatch({ type: USER_SIGNUP, ...error });
    }
  };
}
