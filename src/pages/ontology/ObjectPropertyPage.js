import React from 'react'
import { Card, Popover, List, Spin } from 'antd';
import { getObjectPropertyPage } from '../../api/MastroApi';
import { renderEntity, predicateTypes } from '../../utils/utils'
import ListItem from '../components/ListItem';
import svg from '../../css/role.svg'
import OntologyTabs from './OntologyTabs';


export default class ObjectPropertyPage extends React.Component {
    _isMounted = false;
    state = {
        data: {},
        loading: true
    }

    componentDidMount() {
        this._isMounted = true;
        // console.log(this.props)
        if (this.props.match.params.entityID !== undefined) {
            this.setState({ loading: true })
            getObjectPropertyPage(
                this.props.ontology.name,
                this.props.ontology.version,
                this.props.match.params.entityID,
                this.loaded)
        }
    }

    componentDidUpdate(prevProps) {
        let props = this.props
        if (props.match.params.entityID && prevProps.match.params.entityID !== props.match.params.entityID) {
            this.setState({ loading: true })
            getObjectPropertyPage(
                props.ontology.name,
                props.ontology.version,
                props.match.params.entityID,
                this.loaded)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    loaded = (data) => {
        this._isMounted && this.setState({ data: data, loading: false })
    }

    render() {
        // console.log("OBJECT PROPERTY PAGE", this.props)
        const spin = <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div>

        if (this.state.data.currentEntity === undefined) return spin

        let objectPropertyCharacteristics = []

        this.state.data.objectPropertyFunctional && objectPropertyCharacteristics.push("Functional")
        this.state.data.objectPropertyInverseFunctional && objectPropertyCharacteristics.push("Inverse Functional")
        this.state.data.objectPropertyIrreflexive && objectPropertyCharacteristics.push("Irreflexive")
        this.state.data.objectPropertyReflexive && objectPropertyCharacteristics.push("Reflexive")
        this.state.data.objectPropertySymmetric && objectPropertyCharacteristics.push("Symmetric")
        this.state.data.objectPropertyTransitive && objectPropertyCharacteristics.push("Transitive")
        this.state.data.objectPropertyAsymmetric && objectPropertyCharacteristics.push("Asymmetric")

        const tabs = [
            <OntologyTabs
                titles={[{ key: 'domain', tab: 'Domain' }, { key: 'range', tab: 'Range' }]}
                data={
                    {
                        domain: <ListItem
                            entity
                            axiom={{ owl: 'ObjectPropertyDomain', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.c}
                            data={this.state.data.objectPropertyDomain} />,
                        range: <ListItem
                            entity
                            axiom={{ owl: 'ObjectPropertyRange', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.c}
                            data={this.state.data.objectPropertyRange} />
                    }
                }
            />,
            <OntologyTabs
                titles={[
                    { key: 'objectPropertyCharacteristics', tab: 'Object Property Characteristics' },
                    { key: 'objectPropertyIndividuals', tab: 'Object Property Individuals' },
                ]}
                data={
                    {
                        objectPropertyCharacteristics: <ListItem
                            axiom={{ type: 'ObjectProperty', entity: this.state.data.currentEntity }}
                            data={objectPropertyCharacteristics} />,
                        objectPropertyIndividuals: <ListItem
                            entity
                            predicateType={predicateTypes.op}
                            data={this.state.data.objectPropertyIndividuals} />
                    }
                }
            />
        ]

        return (
            this.state.loading ? spin :

                <div>
                    <div style={{ textAlign: 'center' }}>
                        <h1><img src={svg} alt='' style={{ height: 35, paddingBottom: 4 }} /><span>{renderEntity(this.state.data.currentEntity)}</span></h1>
                        <Popover content={this.state.data.currentEntity.entityIRI} placement='bottom'>
                            <h3>{this.state.data.currentEntity.entityPrefixIRI}</h3>
                        </Popover>
                    </div>
                    <div style={{ paddingBottom: '16px' }}>
                        <Card title="Description" className='description'>
                            <ListItem label data={this.state.data.objectPropertyDescriptions} />
                        </Card>
                    </div>
                    <List
                        grid={{ gutter: 16, lg: 2, md: 2, sm: 1, xs: 1 }}
                        dataSource={tabs}
                        renderItem={item => (
                            <List.Item style={{ paddingBottom: 8 }}>
                                {item}
                            </List.Item>
                        )}
                    />
                    <div style={{ paddingBottom: '16px' }}>
                        <OntologyTabs
                            titles={
                                [
                                    { key: 'equivalentObjectProperties', tab: 'Equivalent Object Properties' },
                                    { key: 'subObjectProperties', tab: 'Sub Object Properties' },
                                    { key: 'superObjectProperties', tab: 'Super Object Properties' },
                                    { key: 'disjointObjectProperties', tab: 'Disjoint Object Properties' },
                                    { key: 'inverseObjectProperties', tab: 'Inverse Object Properties' },
                                ]
                            }
                            data={{
                                equivalentObjectProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'EquivalentObjectProperties', first: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.equivalentObjectProperties} />,
                                subObjectProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'SubObjectPropertyOf', first: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.subObjectProperties} />,
                                superObjectProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'SubObjectPropertyOf', second: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.superObjectProperties} />,
                                disjointObjectProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'DisjointObjectProperties', second: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.disjointObjectProperties} />,
                                inverseObjectProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'InverseObjectProperties', second: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.inverseObjectProperties} />
                            }}
                        />
                    </div>
                </div>

        );
    }
}

