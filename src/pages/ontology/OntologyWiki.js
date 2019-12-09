import React from 'react';
import { Layout } from 'antd';
import ClassPage from './ClassPage';
import ObjectPropertyPage from './ObjectPropertyPage';
import DataPropertyPage from './DataPropertyPage';

import { Route, Redirect } from 'react-router'

import { predicateTypes } from '../../utils/utils'
import IndividualPage from './IndividualPage';
import OntologyDrawer from './OntologyDrawer';

const { Content } = Layout;

export default class OntologyWiki extends React.Component {
    state = {}

    componentDidMount() {
        // console.log("WM " + this.props.match.params.entityID, this.props.match.params.predicateType)
        if (this.props.match.params.entityID) {
            this.setState({
                current: this.props.match.params.entityID,
                predicateType: this.props.match.params.predicateType,
            })
        }
    }

    onHandle = (entityID, predicateType) => {
        if (entityID !== this.state.current) {
            this.setState({
                current: entityID,
                predicateType: predicateType
            })
        }
    }

    render() {
        // console.log("RENDER: ",this.state)
        return (
            <Layout>
                <Layout >
                    <Content >
                        <div style={{ height: 'calc(100vh - 25px)', overflowY: 'auto', padding: 8 }}>
                            <OntologyDrawer
                                ontology={this.props.ontology}
                                onHandle={this.onHandle}
                                visible={!this.props.match.params.entityID} />
                            <Route exact path="/open/ontology/wiki/:predicateType?/:entityID?" render={(props) => {
                                return this.state.current && this.state.predicateType ?
                                    <Redirect push to={"/open/ontology/wiki/" + this.state.predicateType + "/" + this.state.current} />
                                    : null
                                // this.props.match.params.predicateType
                            }} />
                            <Route exact path={"/open/ontology/wiki/" + predicateTypes.c + "/:entityID"} render={(props) => (
                                <ClassPage {...props} ontology={this.props.ontology} />
                            )} />
                            <Route exact path={"/open/ontology/wiki/" + predicateTypes.op + "/:entityID"} render={(props) => (
                                <ObjectPropertyPage {...props} ontology={this.props.ontology} />
                            )} />
                            <Route exact path={"/open/ontology/wiki/" + predicateTypes.dp + "/:entityID"} render={(props) => (
                                <DataPropertyPage {...props} ontology={this.props.ontology} />
                            )} />
                            <Route exact path={"/open/ontology/wiki/" + predicateTypes.i + "/:entityID"} render={(props) => (
                                <IndividualPage {...props} ontology={this.props.ontology} />
                            )} />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
