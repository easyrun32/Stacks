import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  GET_PROJECT,
  PROJECT_LOADING,
  GET_PROJECTS,
  PROJECTS_LOADING
} from "../actions/types";

const initialState = {
  broadcast: [],
  projects: [],
  project: [],
  pictureLoading: false,
  projectLoading: false,
  projectsLoading: false,
  gitLoading: false,
  websiteLoading: false,
  quickLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_PROJECT:
      return {
        ...state,
        projects: [action.payload, ...state.projects]
      };
    case "QUICK_PICTURES":
      return {
        ...state,
        project: action.payload,
        quickLoading: false
      };
    case "QUICK_LOADING":
      return {
        ...state,
        quickLoading: true
      };
    case "UPDATE_PICTURES":
      return {
        ...state,
        project: action.payload,
        pictureLoading: false
      };
    case "PICTURE_LOADING":
      return {
        ...state,
        pictureLoading: true
      };
    case "UPDATE_GIT":
      return {
        ...state,
        project: action.payload,
        gitLoading: false
      };

    case "GIT_LOADING":
      return {
        ...state,
        gitLoading: true
      };
    case "UPDATE_WEBSITE":
      return {
        ...state,
        project: action.payload,
        websiteLoading: false
      };
    case "WEBSITE_LOADING":
      return {
        ...state,
        websiteLoading: true
      };

    case "UPDATE_DETAILS":
      return {
        ...state,
        project: action.payload
      };

    case UPDATE_PROJECT:
      //payload._id is whatever object that needs to be updated
      let index = state.projects.findIndex(
        project => project._id === action.payload._id
      );

      state.projects.splice(index, 1); //deletes targeted  id  at the specific index
      //ignore 1

      //updates the targeted id with whatever they have in the object
      return {
        ...state,
        projects: [action.payload, ...state.projects]
      };
    // case "DELETE_PICTURE":
    //    return{
    //      ...state,
    //      projects: state.projects.filter((project)=>{
    //        project.link !==action.payload
    //      })
    //    }

    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          project => project._id !== action.payload
        )
      };
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload,
        projectLoading: false
      };
    case "GET_BROADCAST":
      return {
        ...state,
        broadcast: action.payload
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        projectsLoading: false
      };

    case PROJECT_LOADING:
      return {
        ...state,
        projectLoading: true
      };
    case PROJECTS_LOADING:
      return {
        ...state,
        projectsLoading: true
      };
    default:
      return state;
  }
}
