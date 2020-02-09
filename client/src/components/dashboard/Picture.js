import React, { Component } from "react";
import trash from "../../trash.png";
import { connect } from "react-redux";
import { deletePicture } from "../../actions/projectsActions";
class Picture extends Component {
  deletePicturemethod = () => {
    this.props.deletePicture(
      this.props.id,
      { url: this.props.picture },
      this.props.url
    );
  };
  render() {
    //console.log(this.props);
    return (
      <div>
        <button onClick={() => this.props.parentCallback(false)}>{"<"}</button>

        <button
          onClick={this.deletePicturemethod}
          style={{
            position: "relative",
            left: "429px",
            height: "30px",
            width: "45px",
            backgroundColor: "Transparent",
            backgroundRepeat: "no-repeat",
            border: "none",
            cursor: "pointer",
            overflow: "hidden",
            outline: "none"
          }}
        >
          <img
            src={trash}
            alt="trash"
            style={{
              height: "30px",
              width: "30px",
              cursor: "pointer"
            }}
          />
        </button>

        <br />

        <img
          src={this.props.picture}
          alt="propimage"
          style={{
            position: "relative",
            height: "500px",
            width: "500px"
          }}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});
//export default Picture;

export default connect(mapStateToProps, {
  deletePicture
})(Picture);
