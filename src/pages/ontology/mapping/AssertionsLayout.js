import React from 'react';
import { Layout, Row, Col } from 'antd';
import AssertionsPage from './AssertionsPage'
import OntologyTree from '../OntologyTree';

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
            current: <AssertionsPage
                ontology={this.props.ontology}
                mappingID={this.props.mappingID}
                current={entityID}
                predicateType={this.state.predicateType}
            />,
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
                        <Row>
                            <Col span={6} style={{ padding: 10, backgroundColor: 'var(--medium-dark)', height: 'calc(100vh - 98px)' }}>
                                <OntologyTree
                                    ontology={this.props.ontology}
                                    visible={this.state.visible}
                                    onHandle={this.onHandle} />
                            </Col>
                            <Col span={18}>
                                {this.state.current}
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

