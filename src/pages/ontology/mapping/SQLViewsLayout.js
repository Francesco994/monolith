import React from 'react';
import { Layout, Drawer, Button, Row, Col } from 'antd';
import SearchList from '../../components/FastSearchList';
import SQLViewsPage from './SQLViewsPage';
import AddSQLView from './AddSQLView';

const {
    Content,
} = Layout;

export default class SQLViewsPane extends React.Component {
    state = {
        current: '',
        visible: true,
        visibleEdit: false,
        sqlView: null
    }

    toggle = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }

    toggleEdit = (sqlView) => {
        this.setState({
            visibleEdit: !this.state.visibleEdit,
            drawer: <AddSQLView
                ontology={this.props.ontology}
                mappingID={this.props.mappingID}
                sqlView={sqlView}
                success={this.toggleEdit} />
        });
    }

    onHandle = (viewID) => {
        this.setState({
            current: <SQLViewsPage
                ontology={this.props.ontology}
                mappingID={this.props.mappingID}
                viewID={viewID}
                edit={this.toggleEdit}
                delete={this.delete}
            />,
            visible: false
        })
    }

    delete = () => {
        this.setState({
            visible: true,
            current: null
        });
    }

    render() {
        return (
            <Layout >
                <Drawer title='Add SQL View'
                    visible={this.state.visibleEdit}
                    onClose={this.toggleEdit}
                    width={'50vw'}>
                    {this.state.drawer}
                </Drawer>
                {/* <Header style={{ backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', lineHeight: 1.5, height: 32 }}>
                    <div style={{ display: 'inline-flex' }}>
                        <SearchList ontology={this.props.ontology} mappingID={this.props.mappingID} onHandle={this.onHandle} />
                    </div>

                </Header> */}
                {/* <Sider
                    // width={200} 
                    style={{ background: '#fff' }}
                >
                    <SearchList />

                </Sider> */}
                <Layout>
                    <Content>
                        <Row>
                            <Col span={6} style={{padding: 10, backgroundColor: 'var(--medium-dark)', height: 'calc(100vh - 98px)'}}>
                                <div style={{display: 'flex', justifyContent: 'row'}}>
                                    <SearchList
                                        ontology={this.props.ontology}
                                        mappingID={this.props.mappingID}
                                        onHandle={this.onHandle} />
                                    <Button
                                        style={{ float: 'right', backgroundColor: 'transparent' }}
                                        onClick={this.toggleEdit}
                                        icon='plus'
                                        shape='circle' />
                                </div>
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