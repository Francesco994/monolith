import React from 'react';
import { Popover, Spin } from 'antd';
import AssertionsList from './AssertionsList';
import { getMappingAssertion, getEntity } from '../../../api/MastroApi';
import Entity from "../Entity";


export default class AssertionsPage extends React.Component {
    _isMounted = false;
    state = {
        data: null,
        loading: true,
        currentEntity: null
    }

    componentDidMount() {
        this._isMounted = true;
        // console.log(this.props)
        if (this.props.current !== undefined) {
            this.setState({ loading: true })
            getMappingAssertion(
                this.props.ontology.name,
                this.props.ontology.version,
                this.props.mappingID,
                this.props.current,
                this.loaded)
        }
    }

    componentWillReceiveProps(props) {
        // console.log(props)
        if (props.current !== undefined) {
            this.setState({ loading: true })
            getMappingAssertion(
                props.ontology.name,
                props.ontology.version,
                props.mappingID,
                props.current,
                this.loaded)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    load = () => {
        this.setState({ loading: true })
        getMappingAssertion(
            this.props.ontology.name,
            this.props.ontology.version,
            this.props.mappingID,
            this.props.current,
            this.loaded)
    }

    loaded = (data) => {
        // console.log(data)
        if (data.length === 0) {
            this.setState({ data: data })
            getEntity(
                this.props.ontology.name,
                this.props.ontology.version,
                this.props.current,
                this.loadedEntity
            )

        }
        else
            this._isMounted &&
                this.setState({ data: data, loading: false, currentEntity: data[0].currentEntity })
    }

    loadedEntity = (entity) => {
        this._isMounted &&
            this.setState({ loading: false, currentEntity: entity })
    }

    render() {
        // console.log(this.state.data)
        if (this.state.data === null || this.state.loading)
            return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}>
                <Spin size='large' /></div>

        return (
            <div>
                <div style={{ textAlign: 'center' }}>
                    <h1>
                        {this.state.data.length} mappings for <Entity
                            entity={this.state.currentEntity}
                            predicateType={this.state.currentEntity.entityType} />
                    </h1>
                    <Popover content={this.state.currentEntity.entityIRI} placement='bottom'>
                        <h3>{this.state.currentEntity.entityPrefixIRI}</h3>
                    </Popover>
                </div>
                <div style={{ height: 'calc(100vh - 163px)', overflowY: 'auto', }}>
                    <AssertionsList
                        ontology={this.props.ontology}
                        mappingID={this.props.mappingID}
                        currentEntity={this.state.currentEntity}
                        predicateType={this.props.predicateType}
                        list={this.state.data}
                        rerender={this.load} />
                </div>
            </div>
        );
    }
}
