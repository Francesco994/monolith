import React from 'react';
import { Route, NavLink } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import KnowledgeGraphClasses from './KnowledgeGraphClasses';

const {
    Header, Content,
} = Layout;

export default class KnowledgeGraphExplore extends React.Component {

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
                        <Menu.Item key="classes">
                            <NavLink to={"/open/kg/explore/classes"} >
                                Class Index
                            </NavLink>
                        </Menu.Item>
                        {/* <Menu.Item key="browse">
                            <NavLink to={"/open/kg/explore/browse"}>
                                Browse
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="graphs">
                            <NavLink to={"/open/kg/explore/graphs"}>
                                Graphs
                            </NavLink>
                        </Menu.Item> */}
                    </Menu>
                </Header>
                <Content>
                    <Route path="/open/kg/explore/classes" render={(props) =>
                        <KnowledgeGraphClasses {...props} kg={this.props.kg} />} />
                </Content>
            </Layout>
        );
    }
}
