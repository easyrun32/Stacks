import React, { Component } from "react";
import "./Inputmodal.scss";
class LinkModal extends Component {
  state = {
    link: ""
  };
  Projectinputcallback = e => {
    e.preventDefault();
    //var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    // problem with \/ within the brackets in the end but git said  this is equal /%
    var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/%]))?/;

    let parselink;
    if (regex.test(this.state.link)) {
      parselink = this.state.link;

      this.props.inputcallback(parselink);
    } else if (this.state.link.length === 0) {
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
    return (
      <div>
        <form className="inputmodalform" onSubmit={this.Projectinputcallback}>
          <input
            onChange={this.onChange}
            value={this.state.link}
            id="link"
            type="text"
            placeholder="Enter your website link"
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

export default LinkModal;
