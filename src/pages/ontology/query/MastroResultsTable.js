import React from 'react'
import { Table, Button, Drawer } from 'antd';
import { getQueryResults, downloadQueryResults, getConstructQueryResults, downloadConstructQueryResults } from '../../../api/MastroApi';
import { saveFileInfo } from '../../../utils/utils'
import LoadKnowledgeGraphs from '../../knowledgeGraph/LoadKnowledgeGraphs';
import { patchKnowledgeGraphUnionQueryOBDA } from '../../../api/KgApi';

// const https = require('https');

// const fakeDataUrl = "https://swapi.co/api/people/"

const POLLING_TIME = 1000;

export default class MastroResultsTable extends React.Component {
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

    componentWillReceiveProps(props) {
        this.polling()
        const pagination = { ...this.state.pagination };
        pagination.total = props.numberOfResults;
        this.setState({ pagination: pagination })
    }

    componentWillUnmount() {
        this.stopPolling()
    }

    downloadResults = () => {
        if (this.props.queryType === 'CONSTRUCT') {
            downloadConstructQueryResults(
                this.props.ontology.name,
                this.props.ontology.version,
                this.props.mappingID,
                this.props.executionID,
                saveFileInfo)
        }
        else {
            downloadQueryResults(
                this.props.ontology.name,
                this.props.ontology.version,
                this.props.mappingID,
                this.props.executionID,
                saveFileInfo)
        }
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
        if (this.props.queryType === 'CONSTRUCT') {
            for (let i = 0; i < results.results.length; i++) {
                let object = {};
                for (let j = 0; j < results.results[i].length; j++) {
                    object[results.headTerms[j]] = results.results[i][j].shortIRI
                }
                object['url'] = i;
                data.push(object);
            }
        }
        else {
            for (let i = 0; i < results.results.length; i++) {
                let object = {};
                for (let j = 0; j < results.results[i].length; j++) {
                    object[results.headTerms[j]] = results.results[i][j].value
                }
                object['url'] = i;
                data.push(object);
            }
        }
        const columns = results.headTerms.map(item => ({ title: item, dataIndex: item }));
        this.setState({ headTerms: columns, data: data, loading: this.state.loading && results.results.length < this.state.pagination.defaultPageSize });
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        if (this.props.queryType === 'CONSTRUCT') {
            // getConstructQueryResults(
            //     this.props.ontology.name,
            //     this.props.ontology.version,
            //     this.props.mappingID,
            //     this.props.executionID,
            //     pager.current,
            //     this.state.pagination.defaultPageSize,
            //     this.convertData.bind(this),
            //     this.stopPolling.bind(this))
        }
        else
            getQueryResults(
                this.props.ontology.name,
                this.props.ontology.version,
                this.props.mappingID,
                this.props.executionID,
                pager.current,
                this.state.pagination.defaultPageSize,
                this.convertData.bind(this),
                this.stopPolling.bind(this))
    }

    polling = () => {
        if (this.props.running) {
            if (this.props.queryType === 'CONSTRUCT') {
                getConstructQueryResults(
                    this.props.ontology.name,
                    this.props.ontology.version,
                    this.props.mappingID,
                    this.props.executionID,
                    this.state.pagination.current,
                    this.state.pagination.defaultPageSize,
                    this.convertData.bind(this),
                    this.stopPolling.bind(this))
            }
            else
                getQueryResults(
                    this.props.ontology.name,
                    this.props.ontology.version,
                    this.props.mappingID,
                    this.props.executionID,
                    this.state.pagination.current,
                    this.state.pagination.defaultPageSize,
                    this.convertData.bind(this),
                    this.stopPolling.bind(this))
        }
        else {
            this.stopPolling()
        }
    }

    addToKnowledgeGraph = () => {
        this.setState({
            visible: true,
            drawer: <LoadKnowledgeGraphs open={this.exportOBDAResultsToKg} drawer />
        })
    }

    onClose = () => {
        this.setState({
            visible: false,
            drawer: null
        });
    }

    exportOBDAResultsToKg = (kgIri) => {
        const knowledgeGraphDestinationQueryOBDA = {
            source: {
                execution: {
                    queryID: this.props.executionID
                },
                source: {
                    ontologyID: {
                        ontologyName: this.props.ontology.name,
                        ontologyVersion: this.props.ontology.version,
                    },

                    mappingID: this.props.mappingID,
                }
            },
            target: {
                destination: kgIri,
                // namedGraph: kgIri,
            }
        }
        patchKnowledgeGraphUnionQueryOBDA(knowledgeGraphDestinationQueryOBDA, this.onClose)
    }

    render() {
        return (
            <div>
                <Drawer
                    visible={this.state.visible}
                    closable={false}
                    onClose={this.onClose}
                    width='45vw'
                >
                    {this.state.drawer}
                </Drawer>
                <Table
                    className='results'
                    style={{ minHeight: 200, marginBottom: 8, overflow: 'auto' }}
                    columns={this.state.headTerms}
                    rowKey={record => record.url}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                />
                {(this.props.queryType === 'CONSTRUCT' || this.props.numberOfResults > 0) &&
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '-57px 0px 30px 1px' }}>
                        {this.props.queryType === 'CONSTRUCT' &&
                            <Button
                                style={{ marginRight: 8 }}
                                type='primary' icon='upload'
                                onClick={this.addToKnowledgeGraph}
                            >
                                Export to Knowledge Graph
                        </Button>
                        }
                        <Button type='primary' icon='download' onClick={this.downloadResults}>
                            Download Query Results
                    </Button>
                        <span style={{ paddingLeft: 8 }} className='results'>{this.props.numberOfResults} results</span>
                    </div>}
            </div>
        );
    }
}
