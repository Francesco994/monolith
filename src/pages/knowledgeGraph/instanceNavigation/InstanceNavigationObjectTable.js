import React from 'react'
import { Link } from 'react-router-dom'
import InstanceNavigationObjectType from './InstanceNavigationObjectType';
import { Card } from 'antd';

export default class InstanceNavigationObjectTable extends React.Component {
    state = {
        expanded: {

        }
    }

    componentDidMount() {
        const obj = this.props.objects
            let expanded = {}
            for (let i = 0; i < obj.object_triples.length; i++) {
                let predicateLink = obj.object_triples[i].predicate;
                expanded[predicateLink] = new Set()
            }
    
        this.setState({ expanded })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.objects !== this.props.objects) {
            const obj = this.props.objects
            let expanded = {}
            for (let i = 0; i < obj.object_triples.length; i++) {
                let predicateLink = obj.object_triples[i].predicate;
                expanded[predicateLink] = new Set()
            }
    
            this.setState({ expanded })
        }
    }

    expandTypeSubject(predicate, type) {
        let expanded = { ...this.state.expanded }
        if (expanded[predicate].has(type)) {
            expanded[predicate].delete(type)
        }
        else
            expanded[predicate].add(type)

        this.setState({ expanded })
    }

    render() {
        const obj = this.props.objects
        if (obj.object_triples.length === 0) return null
        let tableInner = []

        for (let i = 0; i < obj.object_triples.length; i++) {
            let values = []
            let predicate = obj.object_triples[i].predicate_short;
            let predicateLink = obj.object_triples[i].predicate;
            for (let j = 0; j < obj.object_triples[i].subjects_types.length; j++) {
                let type = obj.object_triples[i].subjects_types[j].subject_type;
                let nRes = obj.object_triples[i].subjects_types[j].instance_count;
                let pages = obj.object_triples[i].subjects_types[j].page_count;
                let suff = nRes === 1 ? '' : 's';
                values.push(
                    <li key={j}>
                        <span
                            className='link'
                            onClick={() => this.expandTypeSubject(predicateLink, type, pages)}
                        >
                            {this.props.renderShortIRI(obj.object_triples[i].subjects_types[j].subject_type_short)}
                        </span>
                        {'(' + nRes + ' resource' + suff + ')'}
                        {this.state.expanded[predicateLink] && this.state.expanded[predicateLink].has(type) &&
                            <InstanceNavigationObjectType
                                kg={this.props.kg}
                                resource={this.props.resource}
                                predicate={predicateLink}
                                type={type}
                                pages={pages}
                                renderShortIRI={this.props.renderShortIRI} />}
                    </li>
                )
            }

            tableInner.push(
                <tr key={i} style={{wordBreak: 'break-all'}}>
                    <td>
                        <Link to={'?iri=' + encodeURIComponent(predicateLink)}>
                            {this.props.renderShortIRI(predicate)}
                        </Link>
                    </td>
                    <td>
                        <ul>
                            {values}
                        </ul>
                    </td>
                </tr>
            )

        }

        return (
            <Card tabList={[{ tab: 'Inverse Relations', key: 'ir' }]}>
                <div style={{ overflow: 'auto' }}>
                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                        {/* <thead className='ant-table-thead'>
                            <tr>
                                <th style={{width: '40%'}}>Inverse Relations</th>
                                <th style={{width: '60%'}}></th>
                            </tr>
                        </thead> */}
                        <tbody className='ant-table-tbody'>
                            {tableInner}
                        </tbody>
                    </table>
                </div>
            </Card>
        )
    }
}