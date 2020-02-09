import React, { Component, useState, useEffect } from "react";
import { Modal, Button, ButtonToolbar, Toast } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import jwt_decode from "jwt-decode";
import comment from "./icons/comment.svg";
import Axios from "axios";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.projectpictures.projectname}</h4>
        <div>
          <Carousel>
            {props.projectpictures.link.map((element, index) => (
              <div key={index}>
                <img src={element} alt="carosel" />
                <p className="legend">Git hub link</p>
              </div>
            ))}
          </Carousel>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
function CommentCenteredModal({ postcomment, ...props }) {
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
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="modalcomment">
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
          <form onSubmit={handleSubmit}>
            <label>
              Comment
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

class Publicpicture extends Component {
  state = {
    modalShow: false,
    commentShow: false,
    projectId: "",
    comments: [],
    data: {
      link: [],
      projectname: ""
    }
  };
  postComment = comment => {
    if (localStorage.jwtTokenTeams) {
      let profilelink;
      const token = JSON.parse(localStorage.jwtTokenTeams);
      const decoded = jwt_decode(token);

      if (decoded.profilelink) {
        profilelink = decoded.profilelink;
      } else {
        profilelink =
          "https://storage.googleapis.com/stormybucket/AwesomeRecruiter@demo.com/myprofile.jpg";
      }

      const userComment = {
        username: decoded.name,
        userid: decoded.id,
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
      window.location.href = "/login";
    }
  };

  like(projectId, e) {
    e.preventDefault();
    if (localStorage.jwtTokenTeams) {
      this.props.callbacklike(projectId);
    } else {
      window.location.href = "/login";
    }
  }
  showComment = (projectId, e) => {
    e.preventDefault();
    Axios.post("/api/comments/", { project_id: projectId.projectid }).then(
      res => {
        this.setState({
          commentShow: true,
          comments: res.data,
          projectId: projectId.projectid
        });
      }
    );
  };
  render() {
    let authenticated;
    let email;
    if (localStorage.jwtTokenTeams) {
      const token = JSON.parse(localStorage.jwtTokenTeams);
      const decoded = jwt_decode(token);
      // console.log(decoded);
      email = decoded.email;
      authenticated = true;
    } else {
      authenticated = false;
    }

    return (
      <div>
        <ButtonToolbar>
          <MyVerticallyCenteredModal
            show={this.state.modalShow}
            projectpictures={this.state.data}
            onHide={() => this.setState({ modalShow: false })}
          />
          <CommentCenteredModal
            show={this.state.commentShow}
            comments={this.state.comments}
            postcomment={this.postComment}
            onHide={() =>
              this.setState({ commentShow: false, comments: [], projectId: "" })
            }
          />
        </ButtonToolbar>

        {this.props.projects ? (
          <div className="projectmain">
            <section className="projectmain__cards">
              {this.props.projects.map((element, index) => (
                <div className="projectmain__card" key={index}>
                  <div className="projectmain__cardcontent">
                    {element.link.length > 0 ? <div>{element.name}</div> : null}
                  </div>

                  {element.link.length > 0 ? (
                    <div
                      onClick={() => {
                        this.setState({
                          modalShow: true,
                          data: {
                            link: element.link,
                            projectname: element.name
                          }
                        });
                      }}
                      className="projectmain__maincontainer__box"
                    >
                      <img
                        className="projectmain__maincontainer__projectpic"
                        alt="projectprofile"
                        src={element.link[0]}
                      />
                    </div>
                  ) : null}

                  <div className="projectmain__cardcontent">
                    <span className="atag">
                      <button
                        className="clearbutton"
                        onClick={this.like.bind(this, {
                          projectid: element._id,
                          ownerid: element.owner.id
                        })}
                      >
                        {authenticated ? (
                          <div>
                            {element.likedBy.includes(email) ? (
                              <span role="img" aria-label="heart">
                                ❤️
                              </span>
                            ) : (
                              <div>{element.link[0] ? <div>♡</div> : null}</div>
                            )}
                          </div>
                        ) : (
                          <div>{element.link[0] ? <div>♡</div> : null}</div>
                        )}
                      </button>
                    </span>
                    <span className="atag">
                      {element.link[0] ? (
                        <button
                          className="clearbutton"
                          onClick={this.showComment.bind(this, {
                            projectid: element._id
                          })}
                        >
                          <img
                            className="icon"
                            src={comment}
                            alt="commentbutton"
                          />
                        </button>
                      ) : null}
                    </span>
                  </div>
                  <div className="projectmain__cardcontent">
                    {element.link[0] ? <div>Likes {element.likes}</div> : null}
                  </div>
                </div>
              ))}
            </section>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Publicpicture;
