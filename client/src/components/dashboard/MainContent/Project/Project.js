import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getProject,
  deleteProject,
  updatePicture,
  deletePicture,
  updateGitlink,
  updateWeblink,
  updateQuick
} from "../../../../actions/projectsActions";

import CountUp from "react-countup";
import { Spinner } from "react-bootstrap";
import GitModal from "./GitModal";
import LinkModal from "./LinkModal";
import QuickModal from "./QuickModal";
import "./project.scss";

class Project extends Component {
  state = {
    inputmodal: false,
    component: "",
    selectedFile: null,
    picture: ""
  };

  componentDidMount() {
    this.props.getProject(this.props.match.params.project);
  }
  deleteProject = id => {
    this.props.deleteProject(id, this.props.history);
  };
  createPicture = () => {
    const fd = new FormData();
    fd.append(
      "photolink",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    fd.append("_id", this.props.match.params.project);
    fd.append("email", this.props.auth.user.email);
    this.props.updatePicture(fd, this.props.history);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.project !== prevProps.match.params.project) {
      this.props.getProject(this.props.match.params.project);
    }
    if (this.state.selectedFile !== prevState.selectedFile) {
      this.createPicture();
    }
  }

  fileSelectedHandler = e => {
    this.setState({ selectedFile: e.target.files[0] });
  };
  toggleEditModal = (link, e) => {
    e.stopPropagation();
    this.setState({ picture: link });
  };
  inputFormGithub = childData => {
    if (childData) {
      this.props.updateGitlink({
        github: childData,
        project_id: this.props.project._id
      });
    }

    this.setState({ inputmodal: false, component: "" });
  };

  inputFromLink = childData => {
    if (childData) {
      this.props.updateWeblink({
        website: childData,
        project_id: this.props.project._id
      });
    }

    this.setState({ inputmodal: false, component: "" });
  };
  inputFromQuick = childData => {
    if (childData) {
      //console.log(this.props.auth.user.email);
      this.props.updateQuick({
        link: childData,
        project_id: this.props.project._id
      });

      // this.props.updateWeblink({
      //   website: childData,
      //   project_id: this.props.project._id
      // });
    }

    this.setState({ inputmodal: false, component: "" });
  };

  setQuick = () => {
    this.setState({ inputmodal: true, component: "quick" });
  };

  setGithub = () => {
    this.setState({ inputmodal: true, component: "github" });
  };
  setLink = () => {
    this.setState({ inputmodal: true, component: "link" });
  };

  Git_or_Link = () => {
    switch (this.state.component) {
      case "github":
        return <GitModal inputcallback={this.inputFormGithub} />;
      case "link":
        return <LinkModal inputcallback={this.inputFromLink} />;
      case "quick":
        return <QuickModal inputcallback={this.inputFromQuick} />;
      default:
        return null;
    }
  };

  render() {
    const { project } = this.props;

    let pictures;
    // console.log(this.props.project);
    if (project.link !== undefined) {
      pictures = (
        <div className="mains">
          {!this.props.projectLoading ? (
            <section className="mains__cards">
              {project.link.map((element, index) => (
                <div className="mains__card" key={index}>
                  <div className="effecthover">
                    <div className="mains__imgbox">
                      <img
                        key={index}
                        alt="pictures"
                        src={element}
                        className="mains__img"
                        onClick={this.toggleEditModal.bind(this, element)}
                      />
                    </div>
                    <div className="hoveroverlay">
                      <p
                        className="delete"
                        style={{ position: "absolute" }}
                        onClick={() =>
                          this.props.deletePicture(this.props.project._id, {
                            url: element
                          })
                        }
                      >
                        Delete
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mains__cardupload">
                <div className="imageUpload">
                  <label htmlFor="add-picture">
                    {!this.props.pictureLoading && !this.props.quickLoading ? (
                      <img
                        className="imageUpload__img"
                        src="http://goo.gl/pB9rpQ"
                        alt="imageUpload"
                      />
                    ) : (
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    )}
                  </label>
                  <input
                    id="add-picture"
                    type="file"
                    onChange={this.fileSelectedHandler}
                  />
                </div>
              </div>
            </section>
          ) : (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
        </div>
      );
    }

    return (
      <div>
        <div className="header__container">
          <h1 className="header__logo">{project.name}</h1>
          <div className="header__nav">
            <ul className="header__ul">
              {!this.state.inputmodal && !this.state.component.length ? (
                <div className="header__nav__size">
                  {" "}
                  <li>
                    <p onClick={this.setGithub} className="projecttext">
                      Set Github
                    </p>
                  </li>
                  <li>
                    <p onClick={this.setLink} className="projecttext">
                      Set Link
                    </p>
                  </li>
                  <li>
                    <p onClick={this.setQuick} className="projecttext">
                      Quick screenshot
                    </p>
                  </li>
                  <li>
                    {this.props.project.github !== undefined ? (
                      <div>
                        {!this.props.gitLoading ? (
                          <a className="link" href={this.props.project.github}>
                            Github
                          </a>
                        ) : (
                          <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                          </Spinner>
                        )}
                      </div>
                    ) : (
                      <a href="/Dashboard" className="link">
                        Github
                      </a>
                    )}
                  </li>
                  <li>
                    {this.props.project.website !== undefined ? (
                      <div>
                        {!this.props.websiteLoading ? (
                          <a className="link" href={this.props.project.website}>
                            Website
                          </a>
                        ) : (
                          <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                          </Spinner>
                        )}
                      </div>
                    ) : (
                      <a href="/Dashboard" className="link">
                        Website
                      </a>
                    )}
                  </li>
                </div>
              ) : (
                <li>
                  {/* 
                  <GitModal inputcallback={this.inputFormGithub} />
                  */}
                  {this.Git_or_Link()}
                </li>
              )}
            </ul>
          </div>
          <div className="header__detail">
            <button
              className="header__button"
              onClick={this.deleteProject.bind(
                this,
                this.props.match.params.project
              )}
            >
              Delete {project.name}?
            </button>{" "}
            {this.props.project.likes ? (
              <CountUp start={0} end={this.props.project.likes} delay={0}>
                {({ countUpRef }) => (
                  <div className="CountupLikes">
                    Likes{" "}
                    <span role="img" aria-label="heart">
                      ❤️
                    </span>{" "}
                    <span className="numberpop" ref={countUpRef} />
                  </div>
                )}
              </CountUp>
            ) : (
              <div className="CountupLikes">
                Likes{" "}
                <span role="img" aria-label="heart">
                  ❤️
                </span>{" "}
                0
              </div>
            )}
            <div className="header__comments">Comments</div>
          </div>
        </div>
        {pictures}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  project: state.projects.project,
  gitLoading: state.projects.gitLoading,
  websiteLoading: state.projects.websiteLoading,
  projectLoading: state.projects.projectLoading,
  pictureLoading: state.projects.pictureLoading,
  quickLoading: state.projects.quickLoading
});

export default connect(mapStateToProps, {
  getProject,
  deleteProject,
  updatePicture,
  deletePicture,
  updateGitlink,
  updateWeblink,
  updateQuick
})(Project);
