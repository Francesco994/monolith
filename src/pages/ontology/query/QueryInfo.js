import React from 'react'
import ListMapItem from '../../components/ListMapItem';

export default class QueryInfo extends React.Component {
    render() {

        const data = [
            {
                mapKey: 'Ontology rewritings',
                mapValue: this.props.status.numOntologyRewritings
            },
            {
                mapKey: 'High level unfolded queries',
                mapValue: this.props.status.numHighLevelQueries
            },
            {
                mapKey: 'Optimized queries',
                mapValue: this.props.status.numOptimizedQueries
            },
            {
                mapKey: 'Low level unfolded queries',
                mapValue: this.props.status.numLowLevelQueries
            },
            {
                mapKey: 'Total execution time (ms)',
                mapValue: this.props.status.executionTime
            },
        ]

        return (
            <div>
                <ListMapItem data={data} />
            </div>
        );
    }
}
