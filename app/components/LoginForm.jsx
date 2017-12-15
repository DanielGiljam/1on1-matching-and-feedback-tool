import React from 'react';
import PropTypes from 'prop-types';


export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInput: '',
      pwdInput: '',
    };
    this.usernameChanged = this.usernameChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pwdChanged = this.pwdChanged.bind(this);
  }


  usernameChanged(e) {
    this.setState({ nameInput: e.target.value });
  }
  pwdChanged(e) {
    this.setState({ pwdInput: e.target.value });
  }

  handleSubmit() {
    this.props.onSubmit({ name: this.state.nameInput, pwd: this.state.pwdInput });
  }


  render() {
    return (
      <div className="container">

        <form className="form-signin">
          <img
            src="../app/imgs/Startupsaunatext_white.svg"
            alt="Startup Sauna"
          />
          <input
            className="form-control"
            onChange={this.usernameChanged}
            placeholder="Username"
            required=""
            type="email"
          />
          <input
            className="form-control"
            onChange={this.pwdChanged}
            placeholder="Password"
            required=""
            type="password"
          />
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={this.handleSubmit}
            type="submit"
          >
            Sign in
          </button>
        </form>

      </div>

    );
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};