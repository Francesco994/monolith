import React from 'react';
import { List, Select, Button, Drawer, Spin, Input, Tooltip } from 'antd';
import DatasourceCard from './DatasourceCard';
import DatasourceForm from './DatasourceForm';
import { getDatasources, deleteDatasources } from '../../api/MastroApi';

const Option = Select.Option

export default class Datasources extends React.Component {
    state = {
        data: [],
        filterData: [],
        visible: false,
        drawer: null,
        loading: true
    }

    componentDidMount() {
        this.load()
    }

    load = () => {
        getDatasources(this.loaded)
    }

    loaded = (data) => {
        this.setState({ data, filterData: data, visible: false, loading: false })
    }

    delete = (datasourceID) => {
        deleteDatasources(datasourceID, this.load)
    }

    showDrawer = () => {
        this.setState({
            drawer: <DatasourceForm rerender={this.onClose} />,
            visible: true
        })
    }

    changeSort = (value) => {
        // if (value === 'name')

        // else if (value === 'date')

    }

    open = (open) => {
        this.setState({
            drawer: <DatasourceForm dataSource={this.state.data.find(d => d.id === open)} rerender={this.onClose} />,
            visible: true
        })
    }

    onClose = async () => {
        this.setState({ visible: false, drawer: null })
        await new Promise(resolve => setTimeout(resolve, 500))
        this.load()
    }

    render() {
        return (
            this.state.loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div> :
                <div style={{ padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                        <div style={{ width: 205 }}></div>
                        <div style={{ display: 'flex' }}>
                            <Input 
                                placeholder='Search datasource...' 
                                onChange={(e) => {
                                    this.setState({
                                        filterData: this.state.data.filter(i => i.id.toLowerCase().includes(e.target.value.toLocaleLowerCase()))
                                    })
                                }} 
                                style={{ width: 576, marginRight: 6 }} />
                            <Tooltip title='Search datasource'>
                                <Button
                                    style={{ backgroundColor: 'transparent' }}
                                    onClick={this.showDrawer}
                                    icon='plus'
                                    shape='circle' />
                            </Tooltip>

                        </div>
                        <Select style={{ width: 205 }} defaultValue='date' onChange={this.changeSort}>
                            <Option value='date' >
                                Sort by date
                            </Option>
                            <Option value='name' >
                                Sort by name
                            </Option>
                        </Select>
                    </div>

                    <Drawer
                        width='40vw'
                        onClose={this.onClose}
                        visible={this.state.visible}
                        style={{
                            overflow: 'auto',
                        }}
                    >
                        {this.state.drawer}
                    </Drawer>

                    <List
                        rowKey="ontologiesView"
                        grid={{ gutter: 12, lg: 3, md: 2, sm: 1, xs: 1 }}
                        dataSource={this.state.filterData}
                        renderItem={(item, index) =>
                            <List.Item key={index} style={{ paddingBottom: 6 }} >
                                <DatasourceCard datasource={item} open={this.open} delete={this.delete} />
                            </List.Item>
                        }
                    />
                </div>
        );
    }
}
