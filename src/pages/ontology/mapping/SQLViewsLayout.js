import React from 'react';
import { Layout, Drawer, Button, Tooltip } from 'antd';
import SearchList from '../../components/FastSearchList';
import SQLViewsPage from './SQLViewsPage';
import AddSQLView from './AddSQLView';

const {
    Sider,
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
                <Sider
                    className='thirdMenu'
                    collapsed={this.state.collapsed}
                    width="333"
                    style={{ padding: 4 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'row' }}>
                        <SearchList
                            ontology={this.props.ontology}
                            mappingID={this.props.mappingID}
                            onHandle={this.onHandle} />
                        <Tooltip title='Add SQL view'>
                            <Button
                                style={{ float: 'right', backgroundColor: 'transparent' }}
                                onClick={this.toggleEdit}
                                icon='plus'
                                shape='circle' />
                        </Tooltip>
                    </div>
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