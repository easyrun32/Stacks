import React, { Component } from "react";
import { connect } from "react-redux";
import Create from "../Create";

import {
  logoutUser,
  descriptionUser,
  pictureUser
} from "../../../actions/authActions";

//import Fade from "react-reveal/Fade";
import "./dashboard.scss";
import home from "./home.svg";

import project from "./project.svg";
import avatar from "./avatar.svg";
import plus from "./plus.svg";
import Description from "../Description";
import add from "./add.svg";
class Dashboard extends Component {
  state = {
    showdescription: false,
    selectedFile: null
  };

  //To detect if user uploaded a picture and upload it to google cloud storage
  setProfilepic = () => {
    const fd = new FormData();
    fd.append(
      "profilelink",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    fd.append("_id", this.props.auth.user.id);
    fd.append("email", this.props.auth.user.email);
    this.props.pictureUser(fd);
  };
  // If a something exist in the state datatype selectedFile
  //  after something exists it clears to null
  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedFile !== prevState.selectedFile) {
      this.setProfilepic();
    }
  }

  fileSelectedHandler = e => {
    this.setState({ selectedFile: e.target.files[0] });
  };
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
    window.location.href = "/";
  };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  mountDescription = e => {
    this.setState({ showdescription: true });
  };

  callbackFunction = childData => {
    if (childData.length > 0) {
      this.props.descriptionUser({
        id: this.props.auth.user.id,
        description: childData
      });
      this.setState({ showdescription: false });
    } else {
      this.setState({ showdescription: false });
    }
  };

  render() {
    let editprofile;
    let profilepictureExist = "";

    if (!this.state.showdescription) {
      editprofile = (
        <button className="editprofile" onClick={this.mountDescription}>
          Edit Profile
        </button>
      );
    } else {
      editprofile = null;
    }

    if (this.props.auth.details.profilelink !== undefined) {
      if (this.props.auth.details.profilelink.length > 0) {
        profilepictureExist = this.props.auth.details.profilelink;
      }
    }

    const { projects } = this.props.projects;

    let content;
    let projectData;

    if (projects !== null) {
      projectData = (
        <section className="projectcontainer">
          {projects.map((project, index) => (
            <div className="projectcontainer__card" key={index}>
              <div className="projectcontainer__card__content">
                {project.name}
              </div>
              <div
                onClick={() =>
                  this.props.history.push(`/projects/${project._id}`)
                }
                className="projectcontainer__box"
              >
                {project.link.map((l, index) =>
                  index === 0 ? (
                    <img
                      alt="frontpic"
                      src={l}
                      key={index}
                      className="projectcontainer__img"
                    />
                  ) : null
                )}
                {project.link.length === 0 ? (
                  <img
                    alt="frontpic"
                    src={plus}
                    key={index}
                    className="projectcontainer__img"
                  />
                ) : null}
              </div>
            </div>
          ))}
        </section>
      );

      // projects.map((project, index) => (
      //   <div
      //     key={project._id}
      //     onClick={() => this.props.history.push(`/projects/${project._id}`)}
      //   >
      //   <div className="projectcontainer__projectname">{project.name}</div>
      //   <div className="projectcontainer__box">
      // {project.link.map((l, index) =>
      //   index === 0 ? (
      //     <img
      //       alt="frontpic"
      //       src={l}
      //       key={index}
      //       className="projectcontainer__img"
      //     />
      //   ) : null
      // )}
      //   </div>
      // {project.link.length === 0 ? (
      //   <img alt="frontpic" src={plus} key={index} className="plus" />
      // ) : null}
      // </div>
      // ));
    }

    //top backup
    if (projects !== null) {
      if (projects.length > 0) {
        if (projects.length === 1) {
          //For some reason Fade tag breaks the application  when there's
          // only one Project
          // projectnumber = projects.length;
          content = (
            <>
              <div className="modal-wrapper" style={{ display: "none" }}>
                <Create />
              </div>

              {projectData}
            </>
          );
        } else {
          // projectnumber = projects.length;
          content = (
            <>
              <div className="modal-wrapper" style={{ display: "none" }}>
                <Create />
              </div>
              {projectData}
            </>
          );
        }
      }
    }
    // if statement
    else {
      content = (
        <>
          <div className="projects">
            <div className="no-projects">
              <h1 className="header">You have no projects</h1>

              <div className="modal-wrapper" style={{ display: "none" }}>
                <Create />
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <div>
        <div className="edge">
          {/* For mobile view */}
          <div className="main__container">
            <button className="clearbutton__item">
              <a href="/">
                <img src={home} className="main__img " alt="heart" />
              </a>
            </button>
            <div className="main__left">
              <div className="main__bar "></div>
              Stacks
            </div>

            <button
              onClick={() => this.props.history.push("/create")}
              className="clearbutton__item"
            >
              <img src={project} className="main__img " alt="project" />
            </button>
          </div>

          {/*End of mobile view*/}
          <div className="edge__verticalmenu">
            <div
              onClick={() => (window.location.href = "/")}
              className="edge__verticalmenu__logo"
            >
              Stacks
            </div>

            <div className="edge__verticalmenu__mycontainer">
              {profilepictureExist.length > 0 ? (
                <img
                  alt="avatar"
                  src={profilepictureExist}
                  className="edge__verticalmenu__mypicture"
                />
              ) : (
                <img
                  alt="avatar"
                  src={avatar}
                  className="edge__verticalmenu__mypicture"
                />
              )}

              <div className="edge__verticalmenu__photoinput">
                <label
                  className="edge__verticalmenu__photolabel"
                  htmlFor="file-input"
                >
                  <img
                    src={add}
                    alt="homeinput"
                    className="edge__verticalmenu__plus"
                  />
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={this.fileSelectedHandler}
                />
              </div>
            </div>
            <div className="edge__verticalmenu__username">
              {this.props.auth.user.name}
            </div>
            {/* INPUT BAR*/}
            <div className="edge__verticalmenu__description">
              <div className="biocontainer">
                <p className="bio">{this.props.auth.details.description}</p>
              </div>
              {this.state.showdescription && (
                <Description parentCallback={this.callbackFunction} />
              )}
              <div className="editprofile__section">{editprofile}</div>
            </div>
            <div className="edge__verticalmenu__menu">
              <br />
              <a href="/">
                <button className="edge__verticalmenu__button">Discover</button>
              </a>
            </div>
            <div className="edge__verticalmenu__menu">
              <button
                onClick={() => this.props.history.push("/create")}
                className="edge__verticalmenu__button"
              >
                Create
              </button>
            </div>
            <div className="edge__verticalmenu__menu">Design</div>
            <div className="edge__verticalmenu__menu">
              <button
                onClick={this.onLogoutClick}
                className="edge__verticalmenu__button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        {content}

        <button className="clearbutton__logout" onClick={this.onLogoutClick}>
          <div className="main__logout">Logout</div>
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects
});

export default connect(mapStateToProps, {
  logoutUser,
  descriptionUser,
  pictureUser
})(Dashboard);
