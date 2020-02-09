export const setPicture = Picture => dispatch => {
  dispatch({
    type: "SET_PICTURE",
    payload: Picture
  });
  //history.push("/dashboard");
};
