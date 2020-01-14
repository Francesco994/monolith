import React from 'react'
import { Select, Spin } from 'antd';
import { getKnowledgeGraphNamedGraphs } from '../../api/KgApi';

export default class KnowledgeGraphNamedGraphs extends React.Component {
    state = {
        data: [],
        loading: true
    }

    componentDidMount() {
        getKnowledgeGraphNamedGraphs(
            this.props.kg.kgIri,
            this.loaded
        )
    }

    loaded = (data) => {
        this.setState({ data, loading: false })
    }

    render() {
        return (
            this.state.loading ?
                <Spin size='small' style={{ display: 'flex', justifyContent: 'flex-end', alignContent: 'center', marginRight: 50 }}/>
                :
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignContent: 'center', marginRight: 50 }}>
                    <h3>Filter named graphs: </h3>
                    <Select defaultValue={null} style={{ width: 300, marginLeft: 8 }} onChange={(value) => this.props.filter(value)}>
                        <Select.Option value={null}>All</Select.Option>
                        {this.state.data.map(
                            ng => <Select.Option key={ng} value={ng}>{ng}</Select.Option>
                        )}
                    </Select>
                </div>
        )
    }
}