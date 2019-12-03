import React from 'react'
import { Link } from 'react-router-dom'
import InstanceNavigationSubjectType from './InstanceNavigationSubjectType';
import { Card } from 'antd';
// const arrow = '<br><font color="black">&#8618; </font>';

function renderDataValue(data) {
    if (data.indexOf("^^") >= 0) {
        var ar = data.split("^^");
        return <div>
            {ar[0]}
            <sup>
                <a href={ar[1]}>
                    {ar[1].replace("http://www.w3.org/2001/XMLSchema#", "xsd:")}
                </a>
            </sup>
        </div>;
    }
    else
        return data;
}

export default class InstanceNavigationSubjectTable extends React.Component {
    state = {
        expanded: {

        }
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props) {
        const obj = props.subjects
        let expanded = {}
        for (let i = 0; i < obj.subject_object_properties.length; i++) {
            let predicateLink = obj.subject_object_properties[i].predicate;
            expanded[predicateLink] = new Set()
        }

        this.setState({ expanded })
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
        const obj = this.props.subjects
        if (obj.subject_data_properties.length === 0 && obj.subject_object_properties.length === 0) return null

        let tableInnerD = []
        for (let i = 0; i < obj.subject_data_properties.length; i++) {
            let values = []
            let predicate = obj.subject_data_properties[i].predicate_short;
            let predicateLink = obj.subject_data_properties[i].predicate;

            for (let j = 0; j < obj.subject_data_properties[i].objects.length; j++) {
                values.push(
                    <li key={j}>
                        {renderDataValue(obj.subject_data_properties[i].objects[j].object_literal)}
                    </li>
                )
            }

            tableInnerD.push(
                <tr key={i}>
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

        let tableInnerS = []

        for (let i = 0; i < obj.subject_object_properties.length; i++) {
            let values = []
            let predicate = obj.subject_object_properties[i].predicate_short;
            let predicateLink = obj.subject_object_properties[i].predicate;
            for (let j = 0; j < obj.subject_object_properties[i].objects_types.length; j++) {
                let type = obj.subject_object_properties[i].objects_types[j].object_type;
                let nRes = obj.subject_object_properties[i].objects_types[j].instance_count;
                let pages = obj.subject_object_properties[i].objects_types[j].page_count;
                let suff = nRes === 1 ? '' : 's';
                values.push(
                    <li key={j}>
                        <span
                            className='link'
                            onClick={() => this.expandTypeSubject(predicateLink, type, pages)}
                        >
                            {this.props.renderShortIRI(obj.subject_object_properties[i].objects_types[j].object_type_short)}
                        </span>
                        {'(' + nRes + ' resource' + suff + ')'}
                        {this.state.expanded[predicateLink] && this.state.expanded[predicateLink].has(type) &&
                            <InstanceNavigationSubjectType
                                kg={this.props.kg}
                                resource={this.props.resource}
                                predicate={predicateLink}
                                type={type}
                                pages={pages}
                                renderShortIRI={this.props.renderShortIRI} />}
                    </li>
                )
            }

            tableInnerS.push(
                <tr key={i} style={{ wordBreak: 'break-all' }}>
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
            <Card tabList={[{ tab: 'Direct Relations', key: 'dr' }]} >
                <div style={{ overflow: 'auto' }}>
                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                        {/* <thead className='ant-table-thead'>
                            <tr>
                                <th style={{width: '40%', height: 0}}></th>
                                <th style={{width: '60%', height: 0}}></th>
                            </tr>
                        </thead> */}
                        <tbody className='ant-table-tbody'>
                            {tableInnerD}
                            {tableInnerS}
                        </tbody>
                    </table>
                </div>
            </Card>
        )
    }
}