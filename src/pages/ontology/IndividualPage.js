import React from 'react'
import { Card, Popover, List, Spin } from 'antd';
import { getClassPage } from '../../api/MastroApi';
import svg from '../../css/class.svg'
import { renderEntity, predicateTypes } from '../../utils/utils'
import ListItem from '../components/ListItem';
import OntologyTabs from './OntologyTabs';

export default class IndividualPage extends React.Component {
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
            getClassPage(
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
            getClassPage(
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
        // console.log(data)
        this._isMounted && this.setState({ data: data, loading: false })
    }

    render() {
        // console.log("CLASS PAGE", this.props)
        const spin = <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div>

        if (this.state.data.currentEntity === undefined) return spin

        const tabs = [
            <OntologyTabs
                titles={
                    [
                        { key: 'subClasses', tab: 'Sub Classes' },
                        { key: 'superClasses', tab: 'Super Classes' },
                        { key: 'equivalentClasses', tab: 'Equivalent Classes' },
                        { key: 'disjointClasses', tab: 'Disjoint Classes' },
                        { key: 'disjointUnions', tab: 'Disjoint Unions' },
                    ]
                }
                data={

                    {
                        subClasses: <ListItem
                            entity
                            axiom={{ owl: 'SubClassOf', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.c}
                            data={this.state.data.subClasses} />,
                        superClasses: <ListItem
                            entity
                            axiom={{ owl: 'SubClassOf', second: this.state.data.currentEntity }}
                            predicateType={predicateTypes.c}
                            data={this.state.data.superClasses} />,
                        equivalentClasses: <ListItem
                            entity
                            axiom={{ owl: 'EquivalentClasses', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.c}
                            data={this.state.data.equivalentClasses} />,
                        disjointClasses: <ListItem
                            entity
                            axiom={{ owl: 'DisjoinClasses', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.c}
                            data={this.state.data.disjointClasses} />,
                        disjointUnions: <ListItem
                            union
                            predicateType={predicateTypes.c}
                            data={this.state.data.disjointUnions} />
                    }
                }
            />,
            <OntologyTabs
                titles={
                    [
                        {
                            key: 'objectPropertiesParticipations',
                            tab: 'Object Properties'
                        },
                        {
                            key: 'dataPropertiesParticipations',
                            tab: 'Data Properties'
                        },
                    ]
                }
                data={
                    {
                        objectPropertiesParticipations: <ListItem
                            partecipation
                            axiom={{ owl: 'SubClassOf', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.op}
                            data={this.state.data.objectPropertiesParticipations} />,
                        dataPropertiesParticipations: <ListItem
                            partecipation
                            axiom={{ owl: 'SubClassOf', first: this.state.data.currentEntity }}
                            predicateType={predicateTypes.dp}
                            data={this.state.data.dataPropertiesParticipations} />
                    }
                }
            />,
            <OntologyTabs
                titles={
                    [
                        {
                            key: 'classIndividuals',
                            tab: 'Individuals'
                        }
                    ]
                }
                data={
                    {
                        classIndividuals: <ListItem
                            entity
                            predicateType={predicateTypes.i} data={this.state.data.classIndividuals} />
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
                    <div>
                        <div style={{  }}>
                            <Card title="Description" className='description'>
                                <ListItem label data={this.state.data.classDescriptions} />
                            </Card>
                        </div>
                        <div style={{  }}>
                            {tabs.shift()}
                        </div>
                        <List
                            grid={{ gutter: 12, lg: 2, md: 2, sm: 1, xs: 1 }}
                            dataSource={tabs}
                            renderItem={item => (
                                <List.Item style={{ paddingBottom: 8 }}>
                                    {item}
                                </List.Item>
                            )}
                        />
                    </div>
                </div>

        );
    }
}

