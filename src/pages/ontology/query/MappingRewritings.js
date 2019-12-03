import React from 'react'
import { Table } from 'antd';
import { getMappingRewritings } from '../../../api/MastroApi';

const POLLING_TIME = 1000;

export default class MappingRewritings extends React.Component {
    state = {
        data: [],
        pagination: { current: 1, defaultPageSize: 10, size: 'small' },
        loading: false,
        interval: 0
    };

    componentDidMount() {
        this.startPolling()
    }

    componentWillUnmount() {
        this.stopPolling()
    }

    startPolling() {
        getMappingRewritings(
            this.props.ontology.name,
            this.props.ontology.version,
            this.props.mappingID,
            this.props.executionID,
            this.state.pagination.current,
            this.state.pagination.defaultPageSize,
            this.convertData.bind(this))
        if (this.props.running)
            this.setState({ interval: setInterval(this.polling, POLLING_TIME), loading: true })
    }

    stopPolling() {
        clearInterval(this.state.interval)
        this.setState({ loading: false })
    }

    convertData(results) {
        console.log(results)
        let data = []
        for (let i = 0; i < results.length; i++) {
            data.push({
                key: i,
                value: results[i],
            })
        }
        this.setState({ data: data, loading: this.state.loading && results.length < this.state.pagination.defaultPageSize });
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        getMappingRewritings(
            this.props.ontology.name,
            this.props.ontology.version,
            this.props.mappingID,
            this.props.executionID,
            pager.current,
            this.state.pagination.defaultPageSize,
            this.convertData.bind(this))
    }

    polling = () => {
        if (this.props.running)
            getMappingRewritings(
                this.props.ontology.name,
                this.props.ontology.version,
                this.props.mappingID,
                this.props.executionID,
                this.state.pagination.current,
                this.state.pagination.defaultPageSize,
                this.convertData.bind(this))
        else {
            this.stopPolling()
        }
    }

    handleChange = (page) => {
        const pager = { ...this.state.pagination };
        pager.current = page;
        this.setState({
            pagination: pager,
        });
        this.fetch(pager.current);
    }


    render() {
        console.log(this.state.data)
        return (
            <Table
                columns={[{ dataIndex: 'value' }]}
                showHeader={false}
                pagination={this.state.pagination}
                dataSource={this.state.data}
                loading={this.state.loading}
                onChange={this.handleTableChange}
            />
        )
    }
}
