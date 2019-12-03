import React from 'react'
import { Select, Switch } from 'antd';
import { renders } from '../../utils/utils'
import Datasources from './Datasources';
import { Route, NavLink } from 'react-router-dom'
import { Layout, Menu } from 'antd';

const {
    Header, Content,
} = Layout;

const Option = Select.Option;
export default class Settings extends React.Component {
    state = { currentTab: 'datasource' }

    handleChange = (value) => {
        localStorage.setItem('renderEntity', value)
    }

    tabClick = (key) => {
        this.setState({ currentTab: key })
    }

    changePopoverAxioms = (e) => {
        localStorage.setItem('popoverAxioms', e)
    }

    render() {
        const popoverAxioms = localStorage.getItem('popoverAxioms') === 'true';

        const currTab = [this.props.match.params.tab]

        return (
            <Layout>
                <Header style={{ background: 'transparent' }}>
                    <Menu
                        style={{ background: 'transparent', borderBottom: 'solid 1px var(--highlight-gray)' }}
                        defaultSelectedKeys={currTab}
                        mode="horizontal"
                    >
                        <Menu.Item key="datasource">
                            <NavLink to={"/settings/datasource"} >
                                Datasources
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="render">
                            <NavLink to={"/settings/render"}>
                                Rendering
                            </NavLink>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <Route path="/settings/datasource" render={(props) =>
                        <Datasources />} />
                    <Route path="/settings/render" render={(props) =>
                        <div>
                            <Select
                                style={{ width: 250, padding: 6 }}
                                defaultValue={localStorage.getItem('renderEntity') || renders[0]}
                                onChange={this.handleChange}>
                                {renders.map(r => <Option value={r} key={r}>{r}</Option>)}
                            </Select>
                            <div>
                                <span style={{ padding: '0px 10px', color: 'rgb(255, 255, 255, 0.75)' }}>
                                    Popover Axioms
                            </span>
                                <Switch defaultChecked={popoverAxioms} onChange={this.changePopoverAxioms} />
                            </div>
                        </div>} />
                </Content>
            </Layout>
        )
    }
}