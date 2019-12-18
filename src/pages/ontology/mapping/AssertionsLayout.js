import React from 'react';
import { Layout } from 'antd';
import AssertionsPage from './AssertionsPage'
import OntologyTree from '../OntologyTree';

const {
    Sider,
    Content,
} = Layout;

export default class AssertionsPane extends React.Component {
    state = {
        current: null,
        predicateType: null,
        visible: true
    }

    componentDidMount () {
        // document.getElementsByClassName("dropdown-content")[0].style.height = 'calc(100vh - 204px) !important'
        console.log(document.getElementsByClassName("dropdown-content")[0])
    }
    
    componentDidUpdate() {
        console.log(document.getElementsByClassName("dropdown-content")[0])
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
            <Layout>
                <Sider
                    className='thirdMenu mappingOntologyTree'
                    collapsed={this.state.collapsed}
                    width="333"
                >
                    <OntologyTree
                        style={{height: 'calc(100vh - 98px)', padding: 4}}
                        ontology={this.props.ontology}
                        visible={this.state.visible}
                        onHandle={this.onHandle} />
                </Sider>
                <Layout>
                    <Content>
                        <div style={{ height: 'calc(100vh - 98px)', overflow: 'auto', padding: 8 }}>
                            {this.state.current}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

