import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom'
import './App.css';

import LoginPage from './pages/main/LoginPage'
import MainLayout from './pages/main/MainLayout'
import { Layout } from 'antd';

export default class App extends Component {

  state = { logged: localStorage.getItem('headers') !== null ? true : false }

  login() {
    this.setState({ logged: true })
  }

  logout() {
    localStorage.removeItem('headers')
    this.setState({ logged: false })
  }

  render() {
    return (
      <HashRouter>
        <Layout>
          {this.state.logged ?
            <MainLayout logout={this.logout.bind(this)} /> :
            <LoginPage login={this.login.bind(this)} />}
        </Layout>
      </HashRouter>
    );
  }
}

