import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import "./Auth.scss";
class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  updateError = () => {
    this.setState({ errors: this.props.errors });
  };

  getSnapshotBeforeUpdate(prevProps) {
    return { notify: prevProps.errors !== this.props.errors };
  }
  componentDidUpdate(prevprop, prevstate, snapshot) {
    if (snapshot.notify) {
      this.updateError();
    }

    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
      //console.log(this.props.auth.user.name, "is logged in");
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    console.log(newUser);
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    //console.log("hello");
    const { errors } = this.state;
    /* 
    <div className="base-wrapper">
        <div className="auth-header">Register Below</div>
        <form className="auth-form" noValidate onSubmit={this.onSubmit}>
          <div className="auth-group">
            <label>
              <div className="auth-label">Name</div>
              <input
                onChange={this.onChange}
                value={this.state.name}
                error={errors.name}
                id="name"
                type="text"
                className="auth-input"
              />
              <div className="auth-error">{errors.name}</div>
            </label>
          </div>

          <div className="auth-group">
            <label>
              <div className="auth-label">Email address</div>
              <input
                onChange={this.onChange}
                value={this.state.email}
                error={errors.email}
                id="email"
                type="email"
                className="auth-input"
              />
              <div className="auth-error">{errors.email}</div>
            </label>
          </div>

          <div className="auth-group">
            <label>
              <div className="auth-label">Password</div>
              <input
                onChange={this.onChange}
                value={this.state.password}
                error={errors.password}
                id="password"
                type="password"
                className="auth-input"
              />
              <div className="auth-error">{errors.password}</div>
            </label>
          </div>

          <div>
            <button type="submit" className="auth-button">
              Sign up
            </button>
          </div>
          <div className="bottom-group">
            <Link
              style={{
                textAlign: "center",
                padding: "1px 7px 2px",
                alignItems: "flex-start",
                lineHeight: "38px",
                color: "white",
                textDecoration: "none"
              }}
              to="/login"
              className="auth-button"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    */
    return (
      <div className="backgroundwrapper">
        <div className="wrapper">
          <div className="wrapper__container">
            <h1 className="wrappertext">Register</h1>

            <form className="auth-form" noValidate onSubmit={this.onSubmit}>
              <div className="auth-group">
                <label>
                  <div className="auth-label">Name</div>
                  <input
                    onChange={this.onChange}
                    value={this.state.name}
                    error={errors.name}
                    id="name"
                    type="text"
                    className="auth-input"
                  />
                  <div className="auth-error">{errors.name}</div>
                </label>
              </div>

              <div className="auth-group">
                <label>
                  <div className="auth-label">Email address</div>
                  <input
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="email"
                    className="auth-input"
                  />
                  <div className="auth-error">{errors.email}</div>
                </label>
              </div>

              <div className="auth-group">
                <label>
                  <div className="auth-label">Password</div>
                  <input
                    onChange={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                    className="auth-input"
                  />
                  <div className="auth-error">{errors.password}</div>
                </label>
              </div>

              <div>
                <button type="submit" className="auth-button">
                  Sign up
                </button>
              </div>
              <div className="bottom-group">
                <Link
                  style={{
                    textAlign: "center",
                    padding: "1px 7px 2px",
                    alignItems: "flex-start",
                    lineHeight: "38px",
                    color: "white",
                    textDecoration: "none"
                  }}
                  to="/login"
                  className="auth-button"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
          <ul className="wrapper__bg-bubbles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
