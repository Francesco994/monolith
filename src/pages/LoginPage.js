import React from 'react';
import LoginForm from './LoginForm'
import logo from '../scritta.svg'

export default class LoginPage extends React.Component {

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column',  margin: "auto" }}>
        <img src={logo} alt="logo" style={{ height: 150, padding: 20 }} />
        <LoginForm login={this.props.login} />
      </div>

    );
  }
}
