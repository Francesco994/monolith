import React from 'react'
import { getInstances } from '../../api/KgApi';
import { Table } from 'antd';
import { NavLink } from 'react-router-dom'

export default class KnowledgeGraphInstances extends React.Component {
    state = {
        data: []
    }

    componentDidMount() {
        getInstances(this.props.kg.kgIri, this.props.kgClass, this.props.namedGraph, this.loaded)
    }

    loaded = (data) => {
        this.converData(data)
    }

    converData(receivedData) {
        let data = []
        for (let i = 0; i < receivedData.length; i++) {
            data.push({
                key: i,
                value: <NavLink to={'/open/kg/navigation/?iri=' + receivedData[i].iri_short}>{receivedData[i].label}</NavLink>
            })
        }
        this.setState({ data })
    }

    render() {
        return (
            <div style={{ padding: 8 }}>
                <Table
                    // style={{ maxHeight: 200, overflow: 'auto' }}
                    columns={[{ dataIndex: 'value' }]}
                    showHeader={false}
                    dataSource={this.state.data}
                    // pagination={false}
                />
            </div>
        )
    }
}