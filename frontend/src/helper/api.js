import axios from "axios";
import _ from "lodash";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export async function newRequest(
  { method, url, params, data, headers, hideError, auth },
  server
) {
  url = API_URL + url;

  headers = { ...headers };

  const response = await axios({ method, url, headers, data, auth }).catch(
    ({ response }) => {
      if (
        _.get(response, "status", "") === 401 &&
        (_.get(response, "data.error.message", "") === "token is expired" ||
          _.get(response, "data.data.message", "") === "token is expired")
      ) {
        return;
      }
      if (_.get(response, "data.error")) {
        return Promise.reject(response);
      }
      return { data: response?.data ? response.data : {} };
    }
  );
  return response;
}

export function pending(type) {
  return `${type}_PENDING`;
}

export function fulfilled(type) {
  return `${type}_FULFILLED`;
}
