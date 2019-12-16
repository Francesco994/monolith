import React from 'react';
import { Layout, Spin, Icon } from 'antd';
import { getQueryCatalogKg } from '../../api/KgApi'
import KnowledgeGraphQueryCatalog from './KnowledgeGraphQueryCatalog';
import KnowledgeGraphAddCloseTabs from './KnowledgeGraphAddCloseTabs';

const {
    Sider, Content,
} = Layout;

export default class KnowledgeGraphSPARQLEndpoint extends React.Component {
    _isMounted = false;
    state = {
        catalog: undefined,
        open: null,
        loadingCatalog: true,
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loadingCatalog: true })
        this.requestCatalog()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true
        }
        else {
            return false
        }
    }

    requestCatalog() {
        getQueryCatalogKg(
            this.props.kg.kgIri,
            this.loadedCatalog)
    }

    loadedCatalog = (data) => {
        if (data === undefined)
            data = []

        this._isMounted && this.setState({
            catalog: data,
            loadingCatalog: false
        });
    }

    open = (open) => {
        this._isMounted && this.setState({
            open: open,
        });
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            open: null
        });
    }

    render() {
        return (
            this.state.loadingCatalog ?
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div> :
                <Layout style={{ minHeight: 'calc(100vh - 25px)' }}>
                    <Sider
                        className='thirdMenu'
                        collapsed={this.state.collapsed}
                    >
                        <KnowledgeGraphQueryCatalog
                            kg={this.props.kg}
                            catalog={this.state.catalog}
                            open={this.open}
                            refreshCatalog={this.requestCatalog.bind(this)}
                            collapsed={this.state.collapsed}
                        />
                        <div>
                            <Icon
                                className="ontologyTrigger"
                                style={{ display: "inherit", cursor: "pointer", color: 'white', padding: 4 }}
                                type={this.state.collapsed ? 'right' : 'left'}
                                onClick={this.toggle}
                            />
                        </div>
                    </Sider>
                    <Layout>
                        <Content >
                            <div className='SPARQLTab' style={{ minHeight: '100%' }}>
                                <KnowledgeGraphAddCloseTabs
                                    kg={this.props.kg}
                                    catalog={this.state.catalog}
                                    open={this.state.open}
                                    openF={this.open}
                                    refreshCatalog={this.requestCatalog.bind(this)}
                                />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
        );
    }
}

