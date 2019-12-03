import React from 'react';
import { Card, List, Divider, Spin } from 'antd'
import AssertionsList from './AssertionsList';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/styles/hljs';
import sqlFormatter from 'sql-formatter'
import Dependencies from './Dependencies'
import { getMappingView, deleteMappingView } from '../../../api/MastroApi';
import ListMapItem from '../../components/ListMapItem'


export default class SQLViewsPage extends React.Component {

    state = {
        data: null,
        loading: true
    }

    componentDidMount() {
        this.setState({ loading: true })
        getMappingView(
            this.props.ontology.name,
            this.props.ontology.version,
            this.props.mappingID,
            this.props.viewID,
            this.loaded)
    }

    componentWillReceiveProps(props) {
        this.setState({ loading: true })
        getMappingView(
            props.ontology.name,
            props.ontology.version,
            props.mappingID,
            props.viewID,
            this.loaded)
    }

    loaded = (data) => {
        this.setState({ data: data, loading: false })
    }

    render() {
        const data = this.state.data
        if (this.state.data === null || this.state.loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div>

        const first = [
            {
                mapKey: "Description",
                mapValue: data.sqlView.sqlViewDescription
            },
            {
                mapKey: "Body",
                mapValue: <SyntaxHighlighter language='sql' style={darcula}>
                    {sqlFormatter.format(data.sqlView.sqlViewCode)}
                </SyntaxHighlighter>
            },
        ]
        const elements = [
            <Card
                className='mappingAssertion'
                actions={!this.props.entity && [
                    <span onClick={
                        () => this.props.edit(data.sqlView)
                    }>
                        edit
                    </span>,
                    <span onClick={
                        () => deleteMappingView(
                            this.props.ontology.name,
                            this.props.ontology.version,
                            this.props.mappingID,
                            this.props.viewID,
                            this.props.delete)
                    }>
                        delete
                    </span>
                ]}>
                <ListMapItem data={first} />
            </Card>,
            <Divider>{"Ontology Mappings"}</Divider>,
            <AssertionsList entity list={data.mappingAssertions} />,
            <Divider>{'Dependencies'}</Divider>,
            <Dependencies dependencies={data.mappingDependencies} />

        ]


        return (
            <div style={{ paddingTop: 12 }}>
                <div style={{ textAlign: 'center' }}>
                    <h1>{data.sqlView.sqlViewID}</h1>
                </div>
                <div style={{ height: 'calc(100vh - 143px)', overflowY: 'auto', padding: '0px 8px' }}>
                    <List
                        grid={{ column: 1 }}
                        dataSource={elements}
                        renderItem={item => (
                            <List.Item>
                                {item}
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        );
    }
}
