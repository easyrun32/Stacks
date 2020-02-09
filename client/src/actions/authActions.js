import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";
//USER DETAILS ACTIONS

export const descriptionUser = userData => dispatch => {
  axios
    .post("/api/users/updatedescription", userData)
    .then(res =>
      dispatch({
        type: "UPDATE_USER",
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

export const pictureUser = userData => dispatch => {
  axios
    .post("/api/users/updatepicture", userData)
    .then(res => {
      console.log(res.data);
      dispatch({ type: "UPDATE_USER", payload: res.data });
    })
    .catch(err => console.log(err));
};

export const detailUser = userData => dispatch => {
  axios
    .post("/api/users/getdetail", userData)
    .then(res =>
      dispatch({
        type: "UPDATE_USER",
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

//LOGIN AND REGISTER ACTIONS

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token

export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtTokenTeams", JSON.stringify(token));
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user

      dispatch(setCurrentUser(decoded));
      dispatch(
        setDetailUser({
          description: decoded.description,
          profilelink: decoded.profilelink
        })
      );
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
export const setDetailUser = decoded => {
  return {
    type: "SET_DETAIL",
    payload: decoded
  };
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = history => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtTokenTeams");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));

  history.push("/dashboard");
};
