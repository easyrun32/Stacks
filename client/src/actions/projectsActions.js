import axios from "axios";

import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  GET_PROJECT,
  PROJECT_LOADING,
  GET_PROJECTS,
  PROJECTS_LOADING
} from "./types";

// Create Project
export const createProject = projectData => dispatch => {
  axios
    .post("/api/projects/create", projectData)
    .then(res =>
      dispatch({
        type: CREATE_PROJECT,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

// Update Project
export const updateProject = projectData => dispatch => {
  axios
    .patch("/api/projects/update", projectData)
    .then(res =>
      dispatch({
        type: UPDATE_PROJECT,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};
//Update picture
export const updatePicture = (projectData, history) => dispatch => {
  dispatch(setPictureLoading());
  axios
    .patch("/api/projects/createpicture", projectData)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: "UPDATE_PICTURES",
        payload: res.data
      });
      return res;
    })
    .then(() => {
      // history.push("/dashboard");
      // window.location.reload(false);
    })
    .catch(err => console.log(err));
};

export const updateGitlink = githublink => dispatch => {
  dispatch({
    type: "GIT_LOADING"
  });
  axios
    .post("/api/projects/setgithub", githublink)
    .then(res => {
      //console.log(res.data);
      dispatch({
        type: "UPDATE_GIT",
        payload: res.data
      });
      return res;
    })
    .catch(err => console.log(err));
};

export const updateWeblink = websitelink => dispatch => {
  dispatch({
    type: "WEBSITE_LOADING"
  });
  axios
    .post("/api/projects/setwebsite", websitelink)
    .then(res => {
      dispatch({
        type: "UPDATE_WEBSITE",
        payload: res.data
      });
      return res;
    })
    .catch(err => console.log(err));
};

export const updateQuick = quicklink => dispatch => {
  dispatch({
    type: "QUICK_LOADING"
  });
  axios
    .post("/api/projects/quicksetlink", quicklink)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: "QUICK_PICTURES",
        payload: res.data
      });
      return res;
    })
    .catch(err => console.log(err));
};

export const deletePicture = (id, picturelink, url) => dispatch => {
  axios
    .patch(`/api/projects/deletepicture/${id}`, picturelink)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: "UPDATE_PICTURES",
        payload: res.data
      });
      return res;
    })
    .then(() => {
      //window.location.href = url;
      //window.location.reload(false);
    })
    .catch(err => console.log(err));
};
export const setPictureLoading = () => {
  return {
    type: "PICTURE_LOADING"
  };
};

// Delete Project
export const deleteProject = (id, history) => dispatch => {
  axios
    .delete(`/api/projects/delete/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_PROJECT,
        payload: id
      })
    )
    .then(res => history.push("/dashboard"))
    .catch(err => console.log(err));
};

// Get specific project by id
export const getProject = id => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get(`/api/projects/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECT,
        payload: null
      })
    );
};
export const broadcast = () => dispatch => {
  // dispatch(setProjectsLoading());
  axios
    .get("/api/projects/getall")
    .then(res =>
      dispatch({
        type: "GET_BROADCAST",
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: "GET_BROADCAST",
        payload: null
      })
    );
};

// Get all projects for specific user
export const getProjects = () => dispatch => {
  dispatch(setProjectsLoading());
  axios
    .get("/api/projects")
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: null
      })
    );
};

// Project loading
export const setProjectLoading = () => {
  return {
    type: PROJECT_LOADING
  };
};

// Projects loading
export const setProjectsLoading = () => {
  return {
    type: PROJECTS_LOADING
  };
};
