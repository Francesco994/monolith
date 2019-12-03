import React from 'react';
import LoginForm from './LoginForm'
import logo from '../../scritta.svg'

export default class LoginPage extends React.Component {

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column',  minHeight: '100vh', margin: "auto" }}>
        <img src={logo} alt="logo" style={{ width: '50vw', minWidth: 280, padding: 20 }} />
        <LoginForm login={this.props.login} />
      </div>

    );
  }
}
