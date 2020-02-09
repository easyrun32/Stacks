// React
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Utils
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { setCurrentUser, logoutUser, detailUser } from "./actions/authActions";

// Components
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Layout from "./components/dashboard/Layout";
import NotFound from "./components/404/404";
import Homepage from "./components/Frontpage";
import axios from "axios";
import Publicuser from "./components/Publicuser";
//import { broadcast } from "./actions/projectsActions";
// Check for token to keep user logged in
if (localStorage.jwtTokenTeams) {
  // Set auth token header auth
  const token = JSON.parse(localStorage.jwtTokenTeams);
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  store.dispatch(detailUser({ id: decoded.id }));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./";
  }
}

class App extends Component {
  state = {
    broadcast: []
  };
  // axios.post("/api/projects/create", projectData)
  like = childdata => {
    axios
      .put("/api/projects/like", { projectid: childdata.projectid })
      .then(res => {
        if (res.status === 200) {
          this.setState({ broadcast: res.data });
        }
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };
  componentDidMount() {
    axios.get("/api/projects/getall").then(res => {
      //console.log("get all", res.data);
      this.setState({ broadcast: res.data });
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route
                exact
                path="/"
                component={props => (
                  <Homepage
                    {...props}
                    famous={this.state.broadcast}
                    likecallback={this.like}
                  />
                )}
              />
              <Route exact path="/user/:id" component={Publicuser} />
              <PrivateRoute exact path="/dashboard" component={Layout} />
              <Route
                component={localStorage.jwtTokenTeams ? Layout : NotFound}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
