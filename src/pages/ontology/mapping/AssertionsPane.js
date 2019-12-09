import React from 'react';
import { Layout } from 'antd';
import AssertionsPage from './AssertionsPage'
import OntologyDrawer from '../OntologyDrawer';

const {
    Content,
} = Layout;

export default class AssertionsPane extends React.Component {
    state = {
        current: null,
        predicateType: null,
        visible: true
    }

    onHandle = (entityID, predicateType) => {
        this.setState({
            current: entityID,
            predicateType,
            visible: false
        })
    }

    render() {
        return (
            <Layout >
                {/* <Header style={{ backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', lineHeight: 1.5, height: 32 }}>
                    <div style={{ display: 'inline-flex' }}>
                        <SearchTree ontology={this.props.ontology} onHandle={this.onHandle} />
                    </div>

                </Header> */}
                
                {/* <Sider
                    // width={200} 
                    style={{ background: '#fff' }}
                >
                    <SearchTree ontology={this.props.ontology}/>

                </Sider> */}
                <Layout>
                    <Content >
                        <div>
                        <OntologyDrawer
                            ontology={this.props.ontology}
                            visible={this.state.visible}
                            onHandle={this.onHandle} />
                            {this.state.current !== null &&
                                <AssertionsPage
                                    ontology={this.props.ontology}
                                    mappingID={this.props.mappingID}
                                    current={this.state.current}
                                    predicateType={this.state.predicateType}
                                />}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

