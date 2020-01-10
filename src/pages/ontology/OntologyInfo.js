import React from 'react';
import { List, Card, Spin, Menu, Dropdown, Button } from 'antd';
import MetricsTabs from './MetricsTabs'
import DownloadFile from '../components/DownloadFile'
import { getOntologyVersionInfo } from '../../api/MastroApi';
import ListItem from '../components/ListItem';

export default class OntologyInfo extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            loading: true,
        }
    }

    componentDidMount() {
        //console.log(props.ontology.name + "    " + props.ontology.version)
        this._isMounted = true;
        this.setState({ loading: true })
        getOntologyVersionInfo(
            this.props.ontology.name,
            this.props.ontology.version,
            this.loaded)
    }

    componentDidUpdate(prevProps) {
        if (this.props.ontology !== prevProps.ontology) {
            //console.log(props.ontology.name + "    " + props.ontology.version)
            this.setState({ loading: true })
            getOntologyVersionInfo(
                this.props.ontology.name,
                this.props.ontology.version,
                this.loaded)
        }
    }

    loaded = (data) => {
        if (data === undefined)
            data = []
        this._isMounted && this.setState({
            data: data,
            loading: false
        });
    }

    render() {
        let metricsAxioms = {}

        if (this.state.data.ontologyMetrics !== undefined) {
            let axioms = []
            axioms.push(...this.state.data.ontologyMetrics.classAxioms)
            axioms.push(...this.state.data.ontologyMetrics.objectPropertyAxioms)
            axioms.push(...this.state.data.ontologyMetrics.dataPropertyAxioms)
            axioms.push(...this.state.data.ontologyMetrics.individualAxioms)
            axioms.push(...this.state.data.ontologyMetrics.annotationAxioms)

            metricsAxioms = {
                metrics: this.state.data.ontologyMetrics.metrics,
                axioms: axioms
            }
        }

        let prefixes = []
        this.state.data.prefixes && this.state.data.prefixes.forEach(element => {
            prefixes.push({ mapKey: element.name, mapValue: element.namespace })
        });

        const elements = [
            <MetricsTabs titles={[
                { key: "pm", tab: "Prefixes" }, { key: "imports", tab: "Imports" },
            ]}
                data={{ imports: this.state.data.ontologyImports, pm: prefixes }} />,
            <MetricsTabs titles={[
                { key: "metrics", tab: "Metrics" },
                { key: "axioms", tab: "Axioms" },
            ]}
                data={metricsAxioms} />,

        ]

        return (
            this.state.loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div> :

                <div style={{ padding: 8 }} >
                    <div style={{ textAlign: 'center', padding: 16 }}>
                        <h1 >{this.props.ontology.name}</h1>
                    </div>
                    <h3>{`Ontology IRI: ${this.state.data.ontologyIRI}`}</h3>
                    <h3>
                        <span>
                            <span>Ontology Version IRI: </span>
                            {this.props.ontology.version === 'NO_VERSION_PROVIDED' ?
                                <span className='disabled'>no version defined</span> :
                                <span>{this.props.ontology.version}</span>}
                            <span style={{marginLeft: 8}}>
                                <Dropdown overlay={
                                    <Menu>
                                        {this.props.ontologyVersions.map(i => 
                                            <Menu.Item 
                                                key={i.versionID} 
                                                onClick={() => this.props.open(this.props.ontology.name, i.versionID, this.props.ontologyVersions)}>
                                                {i.versionID}
                                            </Menu.Item>)}
                                    </Menu>
                                }>
                                    <Button icon="down">Other versions</Button>
                                </Dropdown>
                            </span>
                        </span>
                    </h3>
                    <div style={{ paddingBottom: 12 }}>
                        <Card title='Description' className='description'>
                            <ListItem label data={this.state.data.ontologyDescriptions} />
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
                        <DownloadFile ontology={this.props.ontology}
                        />
                    </div>
                </div>
        );
    }
}