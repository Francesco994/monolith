import React from 'react';
import { Tabs, Spin } from 'antd';
import SearchTree from '../components/FastSearchTree';

import { getOntologyVersionHierarchy } from '../../api/MastroApi'

export default class OntologyDrawer extends React.Component {
    _isMounted = false;
    state = { data: [], loading: true, currentTab: 'c', visible: true }

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loading: true, visible: this.props.visible })
        getOntologyVersionHierarchy(
            this.props.ontology.name,
            this.props.ontology.version,
            this.loaded)

        // document.getElementsByClassName("dropdown-trigger")[0].click()

    }

    componentWillUnmount() {
        this._isMounted = false
    }

    loaded = (mastroData) => {
        this._isMounted && this.setState({ data: mastroData, loading: false })
    }

    toggle = () => {
        this.setState({
            visible: !this.state.visible
        });
    }

    onHandle = (...args) => {
        this.props.onHandle(...args)
        this.setState({ visible: false })
    }

    tabClick = (key) => {
        this.setState({ currentTab: key })
    }

    render() {
        return (
            this.state.loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div> :
                <div>
                    <Tabs size='small' onTabClick={this.tabClick} style={this.props.style}>
                        <Tabs.TabPane tab='Classes' key='c'>
                            {this.state.currentTab === 'c' && <SearchTree
                                classes
                                data={this.state.data}
                                onHandle={this.onHandle} />}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab='Object Properties' key='op'>
                            {this.state.currentTab === 'op' && <SearchTree
                                objectProperties
                                data={this.state.data}
                                onHandle={this.onHandle} />}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab='Data Properties' key='dp'>
                            {this.state.currentTab === 'dp' && <SearchTree
                                dataProperties
                                data={this.state.data}
                                onHandle={this.onHandle} />}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab='All' key='a'>
                            {this.state.currentTab === 'a' && <SearchTree
                                all
                                data={this.state.data}
                                onHandle={this.onHandle} />}
                        </Tabs.TabPane>
                    </Tabs>
                </div>
        );
    }
}
