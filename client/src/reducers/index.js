import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import projectsReducer from "./projectsReducer";
import globalReducer from "./globalReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  projects: projectsReducer,
  global: globalReducer
});
