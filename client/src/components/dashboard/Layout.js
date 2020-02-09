import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProjects } from "../../actions/projectsActions.js";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";

import Dashboard from "./MainContent/Dashboard";
import Project from "./MainContent/Project/Project";
import NotFound from "../404/404";
import Create from "./Create";
//import Setgithub from "./MainContent/Project/Setgithub";

class Layout extends Component {
  componentDidMount() {
    this.props.getProjects();
  }
  // bug with not going back in dashboard ;/
  /* 
  Attempted fix must be a better way
  */

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/create" component={Create} />

          <Route exact path="/projects/:project" component={Project} />

          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

Layout.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects
});

export default withRouter(connect(mapStateToProps, { getProjects })(Layout));
