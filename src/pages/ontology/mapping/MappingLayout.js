import React from 'react';
import { Route, NavLink } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import MappingInfo from './MappingInfo';
import AssertionsPane from './AssertionsLayout';
import SQLViewsPane from './SQLViewsLayout';

const {
    Header, Content,
} = Layout;

export default class CurrentMapping extends React.Component {

    render() {

        const currTab = [this.props.match.params.tab]
        return (
            <Layout>
                <Header style={{ background: 'transparent' }}>
                    <Menu
                        style={{ background: 'transparent', borderBottom: 'solid 1px var(--highlight-gray)' }}
                        defaultSelectedKeys={currTab}
                        mode="horizontal"
                    >
                        <Menu.Item key="info">
                            <NavLink to={"/open/ontology/mapping/info/"+this.props.match.params.mappingID} >
                                Mapping Info
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="assertions">
                            <NavLink to={"/open/ontology/mapping/assertions/"+this.props.match.params.mappingID}>
                                Ontology Mappings
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="sqlViews">
                            <NavLink to={"/open/ontology/mapping/sqlViews/"+this.props.match.params.mappingID}>
                                SQL Views
                            </NavLink>
                        </Menu.Item>
                        {/* <Menu.Item key="dependencies">
                            Dependencies
                        </Menu.Item> */}
                    </Menu>
                </Header>
                <Content>
                    <Route path="/open/ontology/mapping/info/" render={(props) =>
                        <MappingInfo {...props} ontology={this.props.ontology} mappingID={this.props.match.params.mappingID}/>} />
                    <Route path="/open/ontology/mapping/assertions" render={(props) =>
                        <AssertionsPane {...props} ontology={this.props.ontology} mappingID={this.props.match.params.mappingID}/>} />
                    <Route path="/open/ontology/mapping/sqlViews" render={(props) =>
                        <SQLViewsPane {...props} ontology={this.props.ontology} mappingID={this.props.match.params.mappingID}/>} />
                </Content>
            </Layout>

        );
    }
}
