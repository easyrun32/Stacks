import React, { Component } from "react";
import Axios from "axios";
import "./Publicuser.scss";

import Publicpicture from "./Publicpicture";
import avatar from "./dashboard/MainContent/avatar.svg";
import home from "./dashboard/MainContent/home.svg";

//import BootstrapModal from "./BootstrapModal";
class Publicuser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  Callbacklike = data => {
    if (localStorage.jwtTokenTeams) {
      Axios.put("/api/projects/user/like", {
        projectid: data.projectid,
        ownerid: data.ownerid
      })
        .then(res => {
          this.setState({ projects: res.data });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      window.location.href = "/login";
    }
  };
  GotoDashboard() {
    if (localStorage.jwtTokenTeams) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }
  componentDidMount() {
    Axios.get(`/api/publicuser/${this.props.match.params.id}`).then(res => {
      //console.log(res.data);
      this.setState(res.data);
    });
  }

  render() {
    return (
      <div>
        <div className="panel">
          {/*Mobile view*/}
          <div className="panelmobileicon">
            <button className="clearbutton__item">
              <a href="/">
                <img src={home} className="panelmobileicon__img" alt="heart" />
              </a>
            </button>

            <div className="panelmobileicon__left">
              <div className="panelmobileicon__bar"></div>
              Stacks
            </div>
            <button className="clearbutton__item" onClick={this.GotoDashboard}>
              <img src={avatar} className="panelmobileicon__img" alt="avatar" />
            </button>
          </div>
          {/*end of Mobile view*/}
          <div className="panel__menu">
            <div className="panel__menu__logo">Stacks</div>

            {this.state.user ? (
              <div className="panel__menu__picbox">
                {this.state.user.profilelink ? (
                  <img
                    className="panel__menu__profilepic"
                    src={this.state.user.profilelink}
                    alt="profilepic"
                  />
                ) : (
                  <img
                    className="panel__menu__emptyprofilepic"
                    src={avatar}
                    alt="empty pic"
                  />
                )}
              </div>
            ) : null}
            <div className="panel__menu__textbox">
              <div className="panel__menu__textbox__username">
                {this.state.user ? <div>{this.state.user.name}</div> : null}
              </div>
              <div className="panel__menu__textbox__bio">
                {this.state.user ? (
                  <div>
                    {this.state.user.description ? (
                      <div>{this.state.user.description}</div>
                    ) : (
                      <div>No description :(</div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="projectmain__maincontainer">
          <Publicpicture
            callbacklike={this.Callbacklike}
            projects={this.state.projects}
          />
          {/* <BootstrapModal projects={this.state.projects} />*/}
        </div>
      </div>
    );
  }
}

export default Publicuser;
