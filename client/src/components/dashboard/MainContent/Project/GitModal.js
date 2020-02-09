import React, { Component } from "react";
import "./Inputmodal.scss";

export class GitModal extends Component {
  state = {
    github: ""
  };

  Projectinputcallback = e => {
    e.preventDefault();

    //var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    // problem with \/ within the brackets in the end but git said  this is equal /%
    var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/%]))?/;

    let parsegithub;
    if (regex.test(this.state.github)) {
      parsegithub = this.state.github;

      this.props.inputcallback(parsegithub);
    } else if (this.state.github.length === 0) {
      this.props.inputcallback();
    } else {
      alert("Please add https:// or http:// in the beginning");
      this.props.inputcallback();
    }
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  render() {
    //console.log(this.props);
    return (
      <div>
        <form className="inputmodalform" onSubmit={this.Projectinputcallback}>
          <input
            onChange={this.onChange}
            value={this.state.github}
            id="github"
            placeholder="Enter your github link"
            type="text"
          />
          <button type="submit">Enter</button>

          {/*
              <button type="submit" id="login-button">
                Login
              </button>
              */}
        </form>
      </div>
    );
  }
}

export default GitModal;
