import React from 'react';
import { Card, List, Divider, Spin, Icon } from 'antd'
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

    componentDidUpdate(prevProps) {
        if (prevProps.viewID !== this.props.viewID) {
            this.setState({ loading: true })
            getMappingView(
                this.props.ontology.name,
                this.props.ontology.version,
                this.props.mappingID,
                this.props.viewID,
                this.loaded)
        }
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
            <Card className='mappingAssertion'>
                <Card.Meta key={this.props.assertion}
                    title={<div></div>}
                    description={<ListMapItem data={first} />}
                />
                {!this.props.entity && 
                    <div className='card-bottom'>
                        <div></div>
                        <div className='card-actions'>
                            <span onClick={
                                () => this.props.edit(data.sqlView)
                            }>
                                <Icon type="edit" theme="filled"/>
                            </span>
                            <span className='delete-icon' style={{paddingLeft: 12}} 
                                onClick={
                                    () => deleteMappingView(
                                        this.props.ontology.name,
                                        this.props.ontology.version,
                                        this.props.mappingID,
                                        this.props.viewID,
                                        this.props.delete)
                                }>
                                <Icon type="delete" theme="filled"/>
                            </span>
                        </div>
                    </div>
                }
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
