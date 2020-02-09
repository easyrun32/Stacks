//Pictures
import mern from "./frontpic/Mern.jpg";
import lamp from "./frontpic/lamp.jpg";
import mean from "./frontpic/mean.jpg";
import django from "./frontpic/django.png";

import React, { Component, useState, useEffect } from "react";
import "./Frontpage.scss";
import git from "./icons/git.svg";
import link from "./icons/link.svg";

import { Link } from "react-router-dom";
import { broadcast } from "../actions/projectsActions";
import { connect } from "react-redux";

import { Modal, Button, Toast } from "react-bootstrap";
import Axios from "axios";

function MyVerticallyCenteredModal({ postcomment, ...props }) {
  useEffect(() => {
    const elem = document.getElementById(`item_${props.comments.length}`);
    elem && elem.scrollIntoView({ block: "end" });
    // elem.scrollIntoView(false);
    // elem.scrollIntoView({ block: "end" });
    //elem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  });

  const [name, setName] = useState("");

  const handleSubmit = evt => {
    evt.preventDefault();
    postcomment(name);
    setName("");
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.projectname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="commentgrid">
            <div className="commentgrid__leftside">
              <h4>By {props.projectuser}</h4>
              <div className="modalproject__box">
                <img
                  className="modalproject__projectpic"
                  src={props.projectpicture}
                  alt="projectpicture"
                />
              </div>
            </div>
            <div className="commentgrid__rightside">
              <div className="comments">
                {props.comments.map((element, i) => (
                  <div id={`item_${i + 1}`} key={i}>
                    <Toast>
                      <Toast.Header>
                        <img
                          style={{ height: "20px" }}
                          src={element.profilelink}
                          className="rounded mr-2"
                          alt=""
                        />
                        <strong className="mr-auto">{element.name}</strong>
                        <small>{element.date}</small>
                      </Toast.Header>
                      <Toast.Body>{element.comment}</Toast.Body>
                    </Toast>
                  </div>
                ))}
              </div>
            </div>

            <div className="commentgrid__bottomrightside">
              <form
                className="commentgrid__bottomrightside__form"
                onSubmit={handleSubmit}
              >
                <label>
                  <input
                    className="commentgrid__bottomrightside__form__input"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </label>
                <input className="clearbutton" type="submit" value="Submit" />
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

class Frontpage extends Component {
  state = {
    postTrigger: false,
    modalShow: false,
    projectId: "",
    projectPicture: "",
    projectName: "",
    projectUser: "",
    comments: []
  };

  like = (el, e) => {
    e.preventDefault();
    if (!localStorage.jwtTokenTeams) {
      this.props.history.push("/login");
    } else {
      this.props.likecallback(el);
    }
    return false;
  };
  userName = (userId, e) => {
    e.preventDefault();
    this.props.history.push(`/user/${userId}`);
  };

  postComment = comment => {
    if (localStorage.jwtTokenTeams) {
      let profilelink;
      if (this.props.auth.details) {
        if (this.props.auth.details.profilelink) {
          profilelink = this.props.auth.details.profilelink;
        } else {
          profilelink =
            "https://storage.googleapis.com/stormybucket/AwesomeRecruiter@demo.com/myprofile.jpg";
        }
      }

      const userComment = {
        username: this.props.auth.user.name,
        userid: this.props.auth.user.id,
        project_id: this.state.projectId,
        comment: comment,
        profilelink: profilelink
      };

      if (comment.length > 0) {
        Axios.post("/api/comments/postcomment", userComment).then(res => {
          this.setState({ comments: res.data });
        });
      }
    } else {
      window.location.href = "./login";
    }
  };
  ShowModal_and_getId(projInfo, e) {
    e.preventDefault();

    Axios.post("/api/comments/", { project_id: projInfo.projectid })
      .then(res => {
        this.setState({
          modalShow: true,
          projectId: projInfo.projectid,
          projectPicture: projInfo.projectpicture,
          projectName: projInfo.projectname,
          projectUser: projInfo.projectuser,
          comments: res.data
        });
      })
      .catch(error => {
        this.setState({
          modalShow: true,
          projectId: projInfo.projectid,
          projectPicture: projInfo.projectpicture,
          projectName: projInfo.projectname,
          projectUser: projInfo.projectuser
        });
      });
  }

  render() {
    let lovedpictures;

    if (this.props.famous.length > 0) {
      // console.log(this.props.famous);
      lovedpictures = (
        <section className="cards">
          {this.props.famous
            .sort((a, b) => {
              return b.likes - a.likes;
            })
            .map((element, index) => (
              <div className="card" key={index} style={{ border: "none" }}>
                <div className="card__content">
                  <p
                    onClick={this.userName.bind(this, element._id.id)}
                    className="card__title text--medium"
                  >
                    {element.name}
                  </p>
                </div>
                {element.link.length > 0 ? (
                  <div className="hovereffect">
                    <img className="imgtag" src={element.link[0]} alt="users" />
                    <div className="overlay">
                      <div className="linkgit">
                        <p className="pgit" onClick={() => console.log("Git")}>
                          {element.github !== undefined ? (
                            <a href={element.github}>
                              <img className="giticon" src={git} alt="git" />
                            </a>
                          ) : (
                            <a href="/">
                              <img className="giticon" src={git} alt="git" />
                            </a>
                          )}
                        </p>
                        <p
                          className="plink"
                          onClick={() => console.log("Link")}
                        >
                          {element.website !== undefined ? (
                            <a href={element.website}>
                              <img className="webicon" src={link} alt="git" />
                            </a>
                          ) : (
                            <a href="/">
                              <img
                                style={{ height: "25px" }}
                                className="giticon"
                                src={link}
                                alt="website"
                              />
                            </a>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="card__content">
                  {/*
                  was in span! 
                  onClick={this.userName.bind(this, element._id.id)}
                  */}
                  <span
                    className="atag"
                    onClick={this.ShowModal_and_getId.bind(this, {
                      projectid: element.projectid,
                      projectpicture: element.link[0],
                      projectname: element.projectname,
                      projectuser: element.name
                    })}
                  >
                    {element.projectname}
                  </span>
                  <span className="atag">
                    <button
                      className="clearbutton"
                      onClick={this.like.bind(this, element)}
                    >
                      {this.props.auth.isAuthenticated ? (
                        <div>
                          {element.likedBy.includes(
                            this.props.auth.user.email
                          ) ? (
                            <span role="img" aria-label="heart">
                              ❤️
                            </span>
                          ) : (
                            <div>♡</div>
                          )}
                        </div>
                      ) : (
                        <div>♡</div>
                      )}
                    </button>
                  </span>
                  <div className="card__title text--medium">
                    <p
                      onClick={this.ShowModal_and_getId.bind(this, {
                        projectid: element.projectid,
                        projectpicture: element.link[0],
                        projectname: element.projectname,
                        projectuser: element.name
                      })}
                    >
                      Comments...
                    </p>
                  </div>
                  <div className="card__info">
                    <p className="text--medium">Likes {element.likes}</p>
                  </div>
                </div>
              </div>
            ))}
        </section>
      );
    }
    return (
      <div className="body">
        {/* */}
        <MyVerticallyCenteredModal
          show={this.state.modalShow}
          projectid={this.state.projectId}
          projectpicture={this.state.projectPicture}
          projectname={this.state.projectName}
          projectuser={this.state.projectUser}
          comments={this.state.comments}
          onHide={() =>
            this.setState({
              modalShow: false,
              projectId: "",
              projectPicture: "",
              projectName: "",
              projectUser: "",
              comments: []
            })
          }
          postcomment={this.postComment}
        />
        <div className="navigation">
          <input type="checkbox" className="navigation__toggler" />

          <div className="navigation__hamburger">
            <div></div>
          </div>

          <div className="navigation__menu">
            <div>
              <div>
                <ul>
                  <li>
                    <Link to="/login">
                      <span className="navigation__spaner">01</span>Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register">
                      <span className="navigation__spaner">02</span>Register
                    </Link>
                  </li>
                  <li>
                    <a href="/">
                      <span className="navigation__spaner">03</span>Discover
                    </a>
                  </li>
                  <li>
                    <a href="/">
                      <span className="navigation__spaner">04</span>Live
                    </a>
                  </li>
                  <li>
                    <a href="/">
                      <span className="navigation__spaner">05</span>Create
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="header__container">
          <h1 className="header__logo">Stacks</h1>
          <div className="header__nav">
            <ul className="header__ul">
              <li className="header__li">
                <a href="/login" className="link">
                  Code Guide
                </a>
              </li>
              <li className="header__li">
                <a href="/login" className="link">
                  Hosting
                </a>
              </li>
              <li className="header__li">
                <a href="/Dashboard" className="link">
                  My Profile
                </a>
              </li>
              <li className="header__li">
                <a href="/login" className="link">
                  Create
                </a>
              </li>
            </ul>
          </div>
          <div className="header__log">
            <Link to="/login" className="link">
              Login
            </Link>
            <br />
            <Link to="/register" className="link">
              Sign up
            </Link>
          </div>
        </div>
        <hr className="hr" />
        <div className="stacktitle">Master A Stack</div>
        <div className="button-images">
          <div className="one_fourth">
            <div className="button-container">
              <a href="https://www.ibm.com/cloud/learn/lamp-stack-explained">
                {" "}
              </a>
              <img alt="alamp" src={lamp} />
            </div>
          </div>
          <div className="one_fourth">
            <div className="button-container">
              <a href="https://codingthesmartway.com/the-mern-stack-tutorial-building-a-react-crud-application-from-start-to-finish-part-1/">
                {" "}
              </a>
              <img alt="mern" src={mern} />
            </div>
          </div>
          <div className="one_fourth">
            <div className="button-container">
              <a href="http://www.bradoncode.com/tutorials/learn-mean-stack-tutorial/">
                {" "}
              </a>
              <div className="button-image">
                {" "}
                <img alt="mean" src={mean} />
              </div>
            </div>
          </div>
          <div className="one_fourth last">
            <div className="button-container">
              <a href="https://scotch.io/tutorials/build-a-to-do-application-using-django-and-react">
                {" "}
              </a>
              <img alt="django" src={django} />
            </div>
          </div>
        </div>

        <div className="broadcast">
          <div className="broadcast__title">Best Of Stacks</div>
          <div className="maine">{lovedpictures}</div>
        </div>
      </div>
    );
  }
}
// <div className="users">{lovedusers}</div>
const mapStateToProps = state => ({
  auth: state.auth,
  popularusers: state.projects.broadcast
});
//export default Frontpage;
export default connect(mapStateToProps, { broadcast })(Frontpage);
