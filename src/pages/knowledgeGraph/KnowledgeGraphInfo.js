import React from 'react';
import { List, Card, Spin } from 'antd';
import DownloadFile from '../components/DownloadFile'
import { getKnowledgeGraphInfo } from '../../api/KgApi';
import ListItem from '../components/ListItem';
import { renderLabel, dateFormat } from '../../utils/utils';
import moment from 'moment';
import MetricsTabs from '../ontology/MetricsTabs';

export default class KnowledgeGraphInfo extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = { data: {}, loading: true }
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({ loading: true })
        getKnowledgeGraphInfo(
            this.props.kg.kgIri,
            this.loaded)
    }

    componentWillReceiveProps(props) {
        this.setState({ loading: true })
        getKnowledgeGraphInfo(
            props.kg.kgIri,
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

    getAgentObject(agent) {
        return [
            { mapKey: 'agentIri', mapValue: agent.agentIri },
            { mapKey: 'agentLabels', mapValue: renderLabel(agent.agentLabels) },
            { mapKey: 'agentWebsite', mapValue: agent.agentWebsite },
            { mapKey: 'agentEmail', mapValue: agent.agentEmail },
            { mapKey: 'agentAddress', mapValue: agent.agentAddress },
        ]
    }

    render() {
        if (this.state.loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div>
        const metrics = {
            metrics: [
                {
                    mapKey: 'Creation time',
                    mapValue: moment(this.state.data.kgCreationTs).format(dateFormat)
                },
                {
                    mapKey: 'Last modified time',
                    mapValue: moment(this.state.data.kgLastModifiedTs).format(dateFormat)
                },
                {
                    mapKey: 'Number of triples',
                    mapValue: this.state.data.kgTriples
                }
            ],
            users: [
                {
                    mapKey: 'Creator',
                    mapValue: this.state.data.kgCreator.name
                },
                {
                    mapKey: 'Contributors',
                    mapValue: this.state.data.kgContributors.map((u, i) => u.name + (i !== this.state.data.kgContributors.length - 1 ? ', ' : ''))
                },
            ]
        }

        const agents = {
            publisher: this.getAgentObject(this.state.data.kgPublisher),
            rightsHolder: this.getAgentObject(this.state.data.kgRightsHolder)
        }


        const elements = [
            <MetricsTabs titles={[
                { key: "metrics", tab: "Metrics" }, { key: "users", tab: "Users" },
            ]}
                data={metrics} />,
            <MetricsTabs titles={[
                { key: "publisher", tab: "Publisher" }, { key: "rightsHolder", tab: "Rights Holder" }
            ]}
                data={agents} />,

        ]

        return (
            <div style={{ padding: 8 }} >
                <div style={{ textAlign: 'center', padding: 16 }}>
                    <h1 >{renderLabel(this.state.data.kgTitle)}</h1>
                </div>
                <h3>{`Knowledge Graph IRI: ${this.state.data.kgIri}`}</h3>
                <div style={{ paddingBottom: 12 }}>
                    <Card title='Description' className='description'>
                        <ListItem label data={this.state.data.kgDescriptions} />
                    </Card>
                </div>
                <List
                    grid={{ gutter: 12, column: 2 }}
                    dataSource={elements}
                    renderItem={item => (
                        <List.Item>
                            {item}
                        </List.Item>
                    )}
                />

                <div style={{ display: 'flex', paddingTop: 12 }}>
                    <DownloadFile kg={this.props.kg}
                    />
                </div>
            </div>
        );
    }
}