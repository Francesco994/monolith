import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { Layout, ConfigProvider, Icon } from 'antd';
// import logo_scritta from '../scritta.svg';
// import logo from '../only_logo.svg';
import MainMenu from './MainMenu'
import Home from './Home'
import LoadOntologies from '../ontology/LoadOntologies'
import CurrentOntology from '../ontology/OntologyLayout';
import Settings from '../settings/Settings';
import UnderConstruction from '../components/UnderConstruction';
import LoadKnowledgeGraphs from '../knowledgeGraph/LoadKnowledgeGraphs';
import CurrentKnowledgeGraph from '../knowledgeGraph/CurrentKnowledgeGraph';
import packageJson from '../../../package.json'
import { getMastroVersion, getJenaVersion } from '../../api/MastroApi';
import { FaSeedling } from 'react-icons/fa';
const { Content, Footer, Sider } = Layout;

export default class MainLayout extends React.Component {
  state = {
    collapsed: true,
    current: {},
    open: {
      ontologies: [],
      kgs: [],
      dss: []
    },
    mastroVersion: '1.0'
  }

  componentWillMount() {
    const mainState = JSON.parse(localStorage.getItem("mainState"))
    this.setState(mainState)

  }

  componentDidMount() {
    getMastroVersion((mastroVersion) => this.setState({ mastroVersion }))
    getJenaVersion((jenaVersion) => this.setState({ jenaVersion }))
  }

  onCollapse = (collapsed) => {
    this.setState((state) => ({
      collapsed: collapsed,
      current: state.current,
      open: state.open
    }));
  }

  openCurrentOntology(ontologyID, versionID, ontologyVersions) {
    const current = {
      name: ontologyID,
      version: versionID
    }
    const openOntologies = Array.from(this.state.open.ontologies)
    let found = false
    for (let item of openOntologies)
      if (item.name === current.name && item.version === current.version) {
        found = true;
        break;
      }

    !found && openOntologies.push(current)

    this.setState((state) => ({
      collapsed: state.collapsed,
      current: current,
      open: {
        ontologies: openOntologies,
        kgs: state.open.kgs,
        dss: state.open.dss
      },
      ontologyVersions
    }))
  }

  openCurrentKg(kgIri) {
    const current = {
      kgIri
    }
    const openKgs = Array.from(this.state.open.kgs)
    let found = false
    for (let item of openKgs)
      if (item.kgIri === current.kgIri) {
        found = true;
        break;
      }

    !found && openKgs.push(current)

    this.setState((state) => ({
      collapsed: state.collapsed,
      current: current,
      open: {
        ontologies: state.open.ontologies,
        kgs: openKgs,
        dss: state.open.dss
      }
    }))
  }

  closeOntology(toClose) {
    let current = this.state.current
    const openOntologies = Array.from(this.state.open.ontologies)
    let filtered
    if (toClose.version !== undefined)
      filtered = openOntologies.filter(item => (item.name !== toClose.name || item.version !== toClose.version))
    else
      filtered = openOntologies.filter(item => (item.name !== toClose.name))
    if (this.state.current !== undefined && toClose.name === this.state.current.name && toClose.version === this.state.current.version) {
      current = filtered[0]
    }
    this.setState((state) => ({
      collapsed: state.collapsed,
      current: current,
      open: {
        ontologies: filtered,
        kgs: state.open.kgs,
        dss: state.open.dss
      }
    }))
  }

  closeKnowledgeGraph(toClose) {
    let current = this.state.current
    const openKgs = Array.from(this.state.open.kgs)
    let filtered = openKgs.filter(item => (item.kgIri !== toClose.kgIri))
    if (this.state.current !== undefined && toClose.kgIri === this.state.current.kgIri) {
      current = filtered[0]
    }
    this.setState((state) => ({
      collapsed: state.collapsed,
      current: current,
      open: {
        ontologies: state.open.ontologies,
        kgs: filtered,
        dss: state.open.dss
      }
    }))
  }

  setCurrent(current) {
    this.setState((state) => ({
      collapsed: state.collapsed,
      current: current,
      open: state.open
    }))
  }

  render() {
    localStorage.setItem('mainState', JSON.stringify(this.state))
    return (
      <Layout style={{ height: '100vh' }} >
        <Sider
          // collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          className='mainMenu'
        >
          <div style={{ position: 'fixed' }}>
            <MainMenu
              collapsed={this.state.collapsed}
              open={this.state.open}
              current={this.state.current}
              setcurrent={this.setCurrent.bind(this)}
              closeOntology={this.closeOntology.bind(this)}
              closeKnowledgeGraph={this.closeKnowledgeGraph.bind(this)}
              logout={this.props.logout}
            />

          </div>
        </Sider>
        <Layout>
          {/* <Header style={{ background: '#fff', padding: 0 }} /> */}
          <Content>
            <ConfigProvider renderEmpty={() =>
              <div style={{ textAlign: 'center' }}>
                <Icon component={FaSeedling} style={{ fontSize: '4em', color: 'var(--highlight-gray)' }} />
                <p style={{color: 'var(--highlight-gray)', paddingTop: 8}}>No Elements</p>
              </div>
              }>
              {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
              {/* <div style={{ padding: '0px' }}> */}
              <Route exact path="/" render={(props) =>
                <Home {...props} openOntology={this.openCurrentOntology.bind(this)} openKg={this.openCurrentKg.bind(this)} />} />

              <Route path="/ontology" render={(props) =>
                <LoadOntologies {...props} open={this.openCurrentOntology.bind(this)} close={this.closeOntology.bind(this)} />} />
              <Route path="/open/ontology/:menu" render={(props) => (
                this.state.current === undefined ?
                  <Redirect to="/" /> :
                  <CurrentOntology
                    {...props}
                    ontology={this.state.current}
                    ontologyVersions={this.state.ontologyVersions}
                    open={this.openCurrentOntology.bind(this)}
                  />
              )
              } />

              <Route path="/kg" render={(props) =>
                <LoadKnowledgeGraphs {...props} open={this.openCurrentKg.bind(this)} close={this.closeOntology.bind(this)} />} />
              <Route path="/open/kg/:menu" render={(props) => (
                this.state.current === undefined ?
                  <Redirect to="/" /> :
                  <CurrentKnowledgeGraph {...props} kg={this.state.current} />
              )
              } />
              <Route path="/dataset" component={() => <UnderConstruction />} />
              <Route path="/admin" component={() => <UnderConstruction />} />
              <Route path="/settings/:tab" render={(props) => <Settings {...props} />} />
              {/* </div> */}
            </ConfigProvider>
          </Content>
          <Footer>
            <div>
              <span>Monolith {packageJson.version} | </span>
              <span>Mastro {this.state.mastroVersion} | </span>
              <span>Jena {this.state.jenaVersion} | </span>
              <a href="http://www.obdasystems.com" target="_blank" rel="noopener noreferrer">OBDA Systems</a>
              <span> © 2018 - {new Date().getFullYear()}</span>
            </div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
