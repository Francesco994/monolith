import React from 'react';
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import { FaInfoCircle, FaBookOpen, FaBezierCurve, FaLink, FaSearchengin } from 'react-icons/fa';

const MenuItem = Menu.Item;


export default class OntologyMenu extends React.Component {
    state = {
        currMenu: ['info']
    }

    componentWillReceiveProps(props) {
        let currMenu = [props.select]
        if (currMenu[0] === 'mapping') currMenu = ['mappings']
        this.setState({ currMenu: currMenu })
    }

    render() {
        return (
            <Menu
                selectedKeys={this.state.currMenu}
                style={{ background: 'transparent', padding: '0px 1px 0px 0px', height: 'calc(100vh - 47px)', overflow: 'auto' }}
                mode="inline">
                <MenuItem key="info" style={{ marginTop: 0 }}>
                    <Link to="/open/ontology/info" >
                        <Icon component={FaInfoCircle} />
                        <span>Info</span>
                    </Link>
                </MenuItem>
                {/* <SubMenu
                    key="doc"
                    title={<span><Icon type="book" /><span>Documentation</span></span>}
                > */}
                <MenuItem key="wiki">
                    <Link to="/open/ontology/wiki" >
                        <Icon component={FaBookOpen} />
                        <span>Navigation</span>
                    </Link>
                </MenuItem>
                <MenuItem key="graphol">
                    <Link to="/open/ontology/graphol" >
                        <Icon component={FaBezierCurve} />
                        <span>Graphol</span>
                    </Link>
                </MenuItem>
                {/* </SubMenu> */}
                <MenuItem key="mappings">
                    <Link to="/open/ontology/mappings" >
                        <Icon component={FaLink} />
                        <span>Mappings</span>
                    </Link>
                </MenuItem>
                {/* <SubMenu
                    key="sparql"
                    title={<span><Icon type="database" /><span>Sparql</span></span>}
                > */}

                <MenuItem key="endpoint">
                    <Link to="/open/ontology/endpoint">
                        <Icon component={FaSearchengin} />
                        <span>Endpoint</span>
                    </Link>
                </MenuItem>

                {/* <MenuItem key="spaqlink">
                        <Link to="/open/ontology/sparqling"><span>Sparqling</span></Link>
                    </MenuItem> */}
                {/* </SubMenu> */}

                {/* <MenuItem key="dataQuality">
                    <Link to="/open/ontology/dataQuality">
                        <Icon type="gold" />
                        <span>Data Quality</span>
                    </Link>
                </MenuItem> */}
            </Menu>
        )
    }
}
