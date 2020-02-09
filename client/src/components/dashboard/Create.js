import React, { Component } from "react";
//import axios from "axios";

import { createProject } from "../../actions/projectsActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./create.scss";

class Create extends Component {
  state = {
    projectName: ""
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSelectChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createProject = () => {
    let project = {
      projectName: this.state.projectName
    };

    this.props.createProject(project);

    this.props.history.push("/dashboard");
  };
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
    this.setState({
      projectName: ""
    });
  };

  render() {
    return (
      <div className="bodycreate">
        <div className="bodycreate__box">
          <form className="bodycreate__form" onSubmit={this.createProject}>
            <label>
              <div className="form-label">Project Name (required)</div>
              <input
                onChange={this.onChange}
                value={this.state.projectName}
                id="projectName"
                type="text"
                placeholder="My Awesome Project"
                className="form-input"
              />
            </label>

            <button type="submit">Create Project</button>
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects
});

export default connect(mapStateToProps, {
  createProject
})(withRouter(Create));
