import React from 'react';
import { Layout, Spin, Icon } from 'antd';
import MastroAddCloseTabs from './MastroAddCloseTabs';
import QueryCatalog from './MastroQueryCatalog';
import { getQueryCatalog, getMappings } from '../../../api/MastroApi'

const {
    Sider, Content,
} = Layout;

export default class MastroSPARQLEndpoint extends React.Component {
    _isMounted = false;
    state = {
        catalog: undefined,
        mappings: undefined,
        open: null,
        loadingCatalog: true,
        loadingMappings: true

    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loadingCatalog: true, loadingMappings: true })
        this.requestCatalog()
        this.requestMappings()
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
        getQueryCatalog(
            this.props.ontology.name,
            this.props.ontology.version,
            this.loadedCatalog)
    }

    loadedCatalog = (data) => {
        if (data === undefined)
            data = []

        this._isMounted && this.setState({
            catalog: data,
            loadingCatalog: false,
            open: null
        });
    }

    requestMappings() {
        getMappings(
            this.props.ontology.name,
            this.props.ontology.version,
            this.loadedMappings)
    }

    loadedMappings = (data) => {
        if (data === undefined)
            data = []
        this._isMounted && this.setState({
            mappings: data.mappingList,
            loadingMappings: false
        });
    }

    open = (open) => {
        this._isMounted && this.setState({
            open: open,
        });
    }

    opened = () => {
        this._isMounted && this.setState({
            open: null,
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
            this.state.loadingCatalog || this.state.loadingMappings ?
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div> :
                <Layout style={{ minHeight: 'calc(100vh - 50px)' }}>
                    <Sider
                        className='thirdMenu'
                        collapsed={this.state.collapsed}
                    >
                        <QueryCatalog
                            ontology={this.props.ontology}
                            mappings={this.state.mappings}
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
                        {/* <MappingSelector ontology={this.props.ontology} mappings={this.state.mappings}/> */}
                    </Sider>
                    <Layout>
                        <Content >
                            <div className='SPARQLTab' style={{ minHeight: '100%' }}>
                                <MastroAddCloseTabs
                                    ontology={this.props.ontology}
                                    mappings={this.state.mappings}
                                    catalog={this.state.catalog}
                                    open={this.state.open}
                                    openF={this.open}
                                    opened={this.opened}
                                    refreshCatalog={this.requestCatalog.bind(this)}
                                />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
        );
    }
}

