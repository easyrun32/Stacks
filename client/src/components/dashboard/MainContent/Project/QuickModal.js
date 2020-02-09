import React, { Component } from "react";
import "./Inputmodal.scss";
class QuickModal extends Component {
  state = {
    quick: ""
  };
  Projectinputcallback = e => {
    e.preventDefault();
    //var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    // problem with \/ within the brackets in the end but git said  this is equal /%
    var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/%]))?/;

    let parsequick;
    if (regex.test(this.state.quick)) {
      parsequick = this.state.quick;

      this.props.inputcallback(parsequick);
    } else if (this.state.quick.length === 0) {
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
          <label />
          <input
            onChange={this.onChange}
            value={this.state.quick}
            id="quick"
            type="text"
            placeholder="website link to screenshot"
          />
          <button type="submit">Enter</button>
        </form>
      </div>
    );
  }
}

export default QuickModal;
