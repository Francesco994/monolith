import React from 'react'
import { getClasses } from '../../api/KgApi';
import { List, Card, Spin } from 'antd';
import KnowledgeGraphInstances from './KnowledgeGraphInstances';
import KnowledgeGraphNamedGraphs from './KnowledgeGraphNamedGraphs';

export default class KnowledgeGraphClasses extends React.Component {
    state = {
        data: [],
        expanded: {},
        loading: true,
        namedGraph: null
    }

    componentDidMount() {
        getClasses(this.props.kg.kgIri, null, this.loaded)
    }

    loaded = (data) => {
        this.setState({ data, loading: false })
    }

    expandClass(className) {
        let expanded = { ...this.state.expanded }
        expanded[className] = !expanded[className]

        this.setState({ expanded })
    }

    render() {
        const receivedData = this.state.data
        let data = []
        for (let i = 0; i < receivedData.length; i++) {
            data.push(<div>
                <span className='link' onClick={() => this.expandClass(receivedData[i])} style={{ background: 'transparent' }}>
                    {receivedData[i]}
                </span>
                {this.state.expanded[receivedData[i]] && <KnowledgeGraphInstances
                    kg={this.props.kg}
                    kgClass={receivedData[i]}
                    namedGraph={this.state.namedGraph}
                />}
            </div>
            )
        }
        return (
            this.state.loading ?
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}>
                    <Spin size='large' />
                </div> :
                <div>
                    <KnowledgeGraphNamedGraphs
                        kg={this.props.kg}
                        filter={namedGraph => {
                            this.setState({ namedGraph })
                            getClasses(this.props.kg.kgIri, namedGraph, this.loaded)
                        }} />
                    <List
                        className='kgInstancesCard'
                        style={{ margin: '0px 6px' }}
                        grid={{ column: 1, gutter: 6 }}
                        dataSource={data}
                        renderItem={(item, index) =>
                            <List.Item key={index}>
                                <Card title={item} style={{ background: 'transparent' }} />
                            </List.Item>

                        } />
                </div>
        )
    }
}