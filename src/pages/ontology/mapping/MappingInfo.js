import React from 'react';
import { List, Card, Spin } from 'antd';
import { Link } from 'react-router-dom'
import DownloadFile from '../../components/DownloadFile'
import { getMappingInfo } from '../../../api/MastroApi';
import ListItem from '../../components/ListItem';


export default class MappingInfo extends React.Component {
    _isMounted = false;
    state = {
        data: {
            mappingDBConnections: [{}]
        },
        showPassword: false,
        loading: true

    }

    componentDidMount() {
        this._isMounted = true
        this.requestMappingInfo()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    requestMappingInfo() {
        this.setState({ loading: true })
        getMappingInfo(
            this.props.ontology.name,
            this.props.ontology.version,
            this.props.mappingID,
            this.loaded)
    }

    loaded = (data) => {
        if (data === undefined)
            data = []
        this._isMounted && this.setState({
            data: data,
            loading: false
        });
    }

    render() {
        if (this.state.loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div>

        const data = this.state.data

        const elements = [
            <Card className='mappingCard' title="Templates">
                <ListItem data={data.mappingTemplates} />
            </Card>,
        ]
        return (
            <div>
                <div style={{ textAlign: 'center', padding: 16 }}>
                    <h1>{this.props.mappingID}</h1>
                    <h3><span>Datasource: </span><Link to='/settings'>{data.mappingDBConnections[0].name}</Link></h3>
                </div>
                <div style={{ height: 'calc(100vh - 163px)', overflow: 'auto' }}>
                    <Card title="Description" className='description' style={{ margin: '0px 6px 12px 6px' }}>
                        {/* <ListItem data={data.mapping?[data.mapping.mappingDescription]:[]} /> */}
                        <p style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{data.mapping && data.mapping.mappingDescription}</p>
                    </Card>
                    <List
                        className='bigCards'
                        grid={{ gutter: 12, column: 1 }}
                        dataSource={elements}
                        renderItem={item => (
                            <List.Item>
                                {item}
                            </List.Item>
                        )}
                    />
                    <div style={{ display: 'flex', padding: '12px 0px' }}>
                        <DownloadFile ontology={this.props.ontology} mapping={this.props.mappingID} />
                    </div>
                </div>
            </div>
        );
    }
}
