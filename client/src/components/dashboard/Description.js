import React, { Component } from "react";

class Description extends Component {
  state = {
    description: ""
  };
  Description = () => {
    this.props.parentCallback(this.state.description);
  };
  onKeyPressed = event => {
    if (event.keyCode === 13) {
      this.Description();
    }
  };
  setButton = () => {
    this.Description();
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  //this.props.parentUnmountCallback
  render() {
    return (
      <div className="inputsection">
        <input
          className="descriptioninput"
          onChange={this.onChange}
          id="description"
          value={this.state.description}
          type="text"
          onKeyDown={this.onKeyPressed}
        />
        <br className="brmobile" />
        <button className="setdescription" onClick={this.setButton}>
          <p className="enter">Enter</p>
        </button>
      </div>
    );
  }
}

export default Description;
