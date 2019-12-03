import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import { Menu, Layout } from 'antd';
import ImportKnowledgeGraphRDF from './KnowledgeGraphImportRDF';

const {
    Header, Content,
} = Layout;

export default class KnowledgeGraphImport extends React.Component {

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
                        <Menu.Item key="files">
                            <NavLink to={"/open/kg/import/files"} >
                                Files
                            </NavLink>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <Route path="/open/kg/import/files" render={(props) =>
                        <ImportKnowledgeGraphRDF {...props} kg={this.props.kg} />} />
                </Content>
            </Layout>
        )
    }
}