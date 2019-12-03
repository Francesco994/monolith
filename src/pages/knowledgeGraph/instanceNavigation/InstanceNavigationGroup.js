import React from 'react'
import { getInstancePage } from '../../../api/KgApi';
import { Spin, Card } from 'antd';
import InstanceNavigationSubjectTable from './InstanceNavigationSubjectTable';
import InstanceNavigationObjectTable from './InstanceNavigationObjectTable';
import { Link } from 'react-router-dom'
import { getUrlVars } from '../../../utils/utils';
import DownloadFile from '../../components/DownloadFile';
import ListItem from '../../components/ListItem';

var resource;

// function renderDescription(ob) {
//     var html = ob.description !== undefined ? '' + ob.description.replace(/&lt;/g, "<").replace(/&gt;/g, ">") : '';
//     return html.replace(/<a/g, '<aa').replace(/<\/a/g, '</aa')
//         .replace(/text-decoration: underline; color:#0000ff;/g, "color:#000000;");
// }



function renderType(ob) {
    if (ob.type === undefined) return '';
    else {
        var type = <Link to={'?iri=' + encodeURIComponent(ob.type)}>{renderShortIRI(ob.type_short)}</Link>
        return type;
    }
}

function renderShortIRI(iri) {
    if (iri === 'other_types')
        return 'Other...';

    if (!iri)
        return '';
    else if (iri.indexOf("http:") >= 0)
        return iri;
    else if (iri.indexOf(":") >= 0) {
        let render = iri.split(/(\w+):(.+)/g)
        return (
            <div>
                <small>{render[1]}:</small>
                {render[2]}
            </div>
        )
    }
    else return iri;
}


export default class InstanceNavigation extends React.Component {

    state = {
        data: {},
        loading: true
    }

    componentDidMount() {
        resource = getUrlVars()["iri"];
        getInstancePage(this.props.kg.kgIri, resource, this.loaded)
    }

    componentWillReceiveProps() {
        resource = getUrlVars()["iri"];
        getInstancePage(this.props.kg.kgIri, resource, this.loaded)
    }

    loaded = (data) => {
        this.setState({ data, loading: false })
    }

    render() {
        if (this.state.loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div>
        const ob = this.state.data.title
        var label = ob.label;
        if (label === undefined) {
            label = ob.iri_short;
        }
        return (
            <div style={{ padding: 8 }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 id="title">{label}</h1>
                    <h3 id="iri">{resource}</h3>
                    <h2 id="type">{renderType(ob)}</h2>
                </div>
                <div style={{ paddingBottom: 16 }}>
                    <Card title="Description" className='description'>
                        <ListItem label data={ob.descriptions} />
                    </Card>
                </div>
                <div style={{ paddingBottom: 16 }}>
                    <InstanceNavigationSubjectTable
                        kg={this.props.kg}
                        resource={resource}
                        subjects={this.state.data.subjects}
                        renderShortIRI={renderShortIRI} />
                </div>
                <div style={{ paddingBottom: 16 }}>
                    <InstanceNavigationObjectTable
                        kg={this.props.kg}
                        resource={resource}
                        objects={this.state.data.objects}
                        renderShortIRI={renderShortIRI} />
                </div>
                <div style={{ display: 'flex' }}>
                    <DownloadFile kgInstance kg={this.props.kg} />
                </div>
            </div>
        )

    }
}