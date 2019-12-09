import React from 'react'
import { Table, Button, Drawer } from 'antd';
import { getQueryResults, downloadQueryResults } from '../../api/KgApi';
import { saveFileInfo } from '../../utils/utils'
import LoadKnowledgeGraphs from './LoadKnowledgeGraphs';

// const https = require('https');

// const fakeDataUrl = "https://swapi.co/api/people/"

const POLLING_TIME = 1000;

export default class KnowledgeGraphResultsTable extends React.Component {
    state = {
        headTerms: [],
        data: [],
        pagination: {
            current: 1,
            defaultPageSize: 10,
        },
        loading: false,
        interval: 0,
        visible: false,
        drawer: null
    };

    componentDidMount() {
        this.startPolling()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.numberOfResults !== this.props.numberOfResults) {
            this.polling()
            const pagination = { ...this.state.pagination };
            pagination.total = this.props.numberOfResults;
            this.setState({ pagination: pagination })
        }
    }

    componentWillUnmount() {
        this.stopPolling()
    }

    downloadResults = () => {
        downloadQueryResults(
            this.props.kg,
            this.props.executionID,
            saveFileInfo)
    }

    startPolling() {
        this.setState({ interval: setInterval(this.polling, POLLING_TIME), loading: true })
    }

    stopPolling() {
        clearInterval(this.state.interval)
        this.setState({ loading: false })
    }

    convertData(results) {

        var data = [];
        if (results.results)
            for (let i = 0; i < results.results.length; i++) {
                var object = {};
                for (let j = 0; j < results.results[i].length; j++) {
                    object[results.headTerms[j]] = results.results[i][j].shortIRI
                }
                object['url'] = i;
                data.push(object);
            }
        this.setState({ headTerms: results.headTerms || [], data: data, loading: this.state.loading && data.length < this.state.pagination.defaultPageSize });
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        getQueryResults(
            this.props.kg,
            this.props.executionID,
            pager.current,
            this.state.pagination.defaultPageSize,
            this.convertData.bind(this),
            this.stopPolling.bind(this))
    }

    polling = () => {
        if (this.props.running)
            getQueryResults(
                this.props.kg,
                this.props.executionID,
                this.state.pagination.current,
                this.state.pagination.defaultPageSize,
                this.convertData.bind(this),
                this.stopPolling.bind(this))
        else {
            this.stopPolling()
        }
    }

    addToKnowledgeGraph = () => {
        this.setState({
            visible: true,
            drawer: <LoadKnowledgeGraphs open={this.exportOBDAResultsToKg} oneColumn />
        })
    }

    onClose = () => {
        this.setState({
            visible: false,
            drawer: null
        });
    }

    exportOBDAResultsToKg = (kgIri) => {
        console.debug('CALL API FOR EXPORTING KG')
    }

    render() {
        const columns = this.state.headTerms.map(item => ({ title: item, dataIndex: item }));
        return (
            <div>
                <Drawer
                    visible={this.state.visible}
                    closable={false}
                    onClose={this.onClose}
                    width='35vw'
                >
                    {this.state.drawer}
                </Drawer>
                <Table
                    className='results'
                    style={{ minHeight: 200, overflow: 'auto' }}
                    columns={columns}
                    rowKey={record => record.url}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                />
                {this.props.numberOfResults > 0 &&
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: -48, marginLeft: 8 }}>
                        <Button type='primary' icon='download' onClick={this.downloadResults}>
                            Download Query Results
                        </Button>
                        <span style={{ paddingLeft: 8 }} className='results'>{this.props.numberOfResults} results</span>
                    </div>}
            </div>
        );
    }
}
