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
                mapKey: 'High level unfold',
                mapValue: this.props.status.numHighLevelQueries
            },
            {
                mapKey: 'Optimized',
                mapValue: this.props.status.numOptimizedQueries
            },
            {
                mapKey: 'Low level unfold',
                mapValue: this.props.status.numLowLevelQueries
            },
            {
                mapKey: 'Total time (ms)',
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
