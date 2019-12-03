import React from 'react'
import { Card } from 'antd';
import QueryInfo from './QueryInfo'
import OntologyRewritings from './OntologyRewritings';
import MappingRewritings from './MappingRewritings';
import ViewRewritings from './ViewRewritings';
import DownloadFile from '../../components/DownloadFile';

export default class MastroQueryExecutionReport extends React.Component {
    state = {
        tabKey: 'qi',
    }

    onTabChange = (key, type) => {
        // console.log(key, type);
        this.setState({ [type]: key });
    }

    render() {

        const tabList = [
            { key: "qi", tab: "Query Info" },
            { key: "or", tab: "Ontology Rewritings" },
            { key: "mr", tab: "View Rewritings" },
            { key: "vr", tab: "SQL Rewritings" },
        ];

        const contentList = {
            qi: <QueryInfo status={this.props.status} />,
            or: <OntologyRewritings
                ontology={this.props.ontology}
                mappingID={this.props.mappingID}
                executionID={this.props.executionID}
                running={this.props.running} />,
            mr: <MappingRewritings
                ontology={this.props.ontology}
                mappingID={this.props.mappingID}
                executionID={this.props.executionID}
                running={this.props.running}
            />,
            vr: <ViewRewritings
                ontology={this.props.ontology}
                mappingID={this.props.mappingID}
                executionID={this.props.executionID}
                running={this.props.running}
            />,
        }

        return (
            <div>
                <Card
                    className='queryExecutionReport'
                    style={{ width: '100%' }}
                    tabList={tabList}
                    activeTabKey={this.state.tabKey}
                    onTabChange={(key) => { this.onTabChange(key, 'tabKey'); }}
                >
                    <div style={{ height: 340, width: '100%', overflow: 'auto' }}>
                        {contentList[this.state.tabKey]}
                    </div>
                </Card>
                <div style={{ display: 'flex', paddingTop: 4 }}>
                    <DownloadFile title='Download Query Report'/>
                </div>
            </div>
        );
    }
}
