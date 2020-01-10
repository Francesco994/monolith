import React from 'react'
import { Card, Popover, List, Spin, Button } from 'antd';
import { getDataPropertyPage } from '../../api/MastroApi';
import svg from '../../css/attr.svg'
import { renderEntity, predicateTypes } from '../../utils/utils'
import ListItem from '../components/ListItem';
import OntologyTabs from './OntologyTabs';

export default class DataPropertyPage extends React.Component {
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
            getDataPropertyPage(
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
            getDataPropertyPage(
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

        let dataPropertyCharacteristics = []

        this.state.data.dataPropertyFunctional && dataPropertyCharacteristics.push("Functional")

        const tabs = [
            <OntologyTabs
                titles={[{ key: 'domain', tab: 'Domain' }, { key: 'range', tab: 'Range' }]}
                data={
                    {
                        domain: <ListItem
                            entity
                            axiom={{ owl: 'DataPropertyDomain', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.c}
                            data={this.state.data.dataPropertyDomain} />,
                        range: <ListItem
                            entity
                            axiom={{ owl: 'DataPropertyRange', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.c}
                            data={this.state.data.dataPropertyRange} />
                    }
                }
            />,

            <OntologyTabs
                titles={[
                    { key: 'dataPropertyCharacteristics', tab: 'Data Property Characteristics' },
                    { key: 'dataPropertyIndividuals', tab: 'Data Property Individuals' },
                ]}
                data={
                    {
                        dataPropertyCharacteristics: <ListItem
                            axiom={{ type: 'DataProperty', entity: this.state.data.currentEntity }}
                            data={dataPropertyCharacteristics} />,
                        dataPropertyIndividuals: <ListItem
                            entity
                            predicateType={predicateTypes.op}
                            data={this.state.data.dataPropertyIndividuals} />
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
                        <Card
                            title={<div>
                                Description
                                    <Button
                                        ghost
                                        icon={this.state.fullScreen ? 'fullscreen-exit' : 'fullscreen'}
                                        style={{ float: 'right' }}
                                        onClick={() => this.setState({ fullScreen: !this.state.fullScreen })}
                                    />
                                </div>} className={'description' + (this.state.fullScreen ? ' fullscreen' : '')}>
                            <ListItem label data={this.state.data.dataPropertyDescriptions} />
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
                    <div>
                        <OntologyTabs
                            titles={
                                [
                                    { key: 'equivalentDataProperties', tab: 'Equivalent Data Properties' },
                                    { key: 'subDataProperties', tab: 'Sub Data Properties' },
                                    { key: 'superDataProperties', tab: 'Super Data Properties' },
                                    { key: 'disjointDataProperties', tab: 'Disjoint Data Properties' },
                                    { key: 'inverseDataProperties', tab: 'Inverse Data Properties' },
                                ]
                            }
                            data={{
                                equivalentDataProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'EquivalentDataProperties', first: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.equivalentDataProperties} />,
                                subDataProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'SubDataPropertyOf', first: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.subDataProperties} />,
                                superDataProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'SubDataPropertyOf', second: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.superDataProperties} />,
                                disjointDataProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'DisjointDataProperties', second: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.disjointDataProperties} />,
                                inverseDataProperties: <ListItem
                                    entity
                                    axiom={{ owl: 'InverseDataProperties', second: this.state.data.currentEntity }}
                                    predicateType={predicateTypes.op}
                                    data={this.state.data.inverseDataProperties} />
                            }}
                        />
                    </div>
                </div>

        );
    }
}

