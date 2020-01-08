import React from 'react'
import { NavLink } from 'react-router-dom'
import { List, Card, Popover, Spin, Button, Icon, Drawer, Modal, Select, Input, Tooltip } from 'antd';
import { getKnowledgeGraphs, deleteKnowledgeGraph } from '../../api/KgApi';
import { dateFormat } from '../../utils/utils';
import moment from 'moment'
import AddKnowledgeGraph from './AddKnowledgeGraph';

const Option = Select.Option
export default class LoadKnowledgeGraphs extends React.Component {
    _isMounted = false;
    state = {
        data: [],
        filterData: [],
        visible: false,
        drawer: null,
        loading: true,
        modalVisible: false,
        toDelete: null
    }

    componentDidMount() {
        this._isMounted = true;
        this.requestKnowledgeGraphs()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    showDrawer = () => {
        this.setState({
            visible: true,
            drawer: <AddKnowledgeGraph onClose={this.onClose} />
        });
    };

    onClose = async () => {
        this.setState({
            visible: false,
            drawer: null
        });
        await new Promise(resolve => setTimeout(resolve, 500))
        this.requestKnowledgeGraphs()
    };

    requestKnowledgeGraphs() {
        this._isMounted && this.setState({ loading: true })
        getKnowledgeGraphs(
            this.loaded)
    }

    loaded = (data) => {
        if (data === undefined)
            data = []
        data.sort(this.sortByDateD)
        this._isMounted && this.setState({
            data,
            filterData: data,
            loading: false
        });
    }

    delete(kg) {
        deleteKnowledgeGraph(
            kg.kgIri,
            () => {
                this.setState({ modalVisible: false, toDelete: null })
                this.requestKnowledgeGraphs()
            })
    }

    changeSort = (value) => {
        if (value === 'name')
            this.setState({
                filterData: this.state.data.sort(this.sortByName)
            })
        else if (value === 'date')
            this.setState({
                filterData: this.state.data.sort(this.sortByDate)
            })
        else if (value === 'dateD')
            this.setState({
                filterData: this.state.data.sort(this.sortByDateD)
            })
    }

    sortByDate(a, b) {
        var x = a.kgCreationTs;
        var y = b.kgCreationTs;
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    }

    sortByDateD(a, b) {
        var x = a.kgCreationTs;
        var y = b.kgCreationTs;
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
    }

    sortByName(a, b) {
        var x = a.kgTitle[0].content.toLowerCase();
        var y = b.kgTitle[0].content.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    }


    render() {
        return (
            this.state.loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}>
                <Spin size='large' /></div> :

                <div>
                    <Modal
                        closable={false}
                        visible={this.state.modalVisible}
                        onOk={() => this.delete(this.state.toDelete)}
                        onCancel={() => this.setState({ modalVisible: false, toDelete: null })}
                    >
                        <div>
                            <div>Delete knowledge graph?</div>
                            <div>Warning: this operation is irreversibile and will cause all data of the knowledge graph to be deleted!</div>
                        </div>
                    </Modal>
                    <Drawer
                        title="Create a new knowledge graph"
                        width='35vw'
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}
                    >
                        {this.state.drawer}
                    </Drawer>
                    {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 6 }}>
                        <div style={{ width: 140 }}></div>
                        <h1 style={{ maxWidth: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Knowledge Graphs
                        </h1>
                        <Select style={{ width: 205 }} defaultValue='dateD' onChange={this.changeSort}>
                            <Option value='dateD' >
                                Sort by date (descending)
                            </Option>
                            <Option value='date' >
                                Sort by date (ascending)
                            </Option>
                            <Option value='name' >
                                Sort by title
                            </Option>
                        </Select>
                    </div> */}
                    <h1 style={{ display: 'flex', justifyContent: 'center' }}>Knowledge Graphs</h1>
                    <div style={{ padding: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                            <div style={{ width: 205 }}></div>
                            <div style={{ display: 'flex' }}>
                                <Input
                                    placeholder='Search knowledge graph...'
                                    onChange={(e) => {
                                        this.setState({
                                            filterData: this.state.data.filter(i => (
                                                i.kgIri.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                                i.kgTitle[0].content.toLowerCase().includes(e.target.value.toLowerCase())
                                            ))
                                        })
                                    }}
                                    style={{ width: 576, marginRight: 6 }} />
                                <Tooltip title="Add knowledge graph">
                                    <Button
                                        style={{ backgroundColor: 'transparent' }}
                                        onClick={this.showDrawer}
                                        icon='plus'
                                        shape='circle' />
                                </Tooltip>
                            </div>
                            <Select style={{ width: 205 }} defaultValue='dateD' onChange={this.changeSort} >
                                <Option value='dateD' >
                                    Sort by date (descending)
                                </Option>
                                <Option value='date' >
                                    Sort by date (ascending)
                                </Option>
                                <Option value='name' >
                                    Sort by name
                                </Option>
                            </Select>
                        </div>
                    </div>
                    <List
                        style={{ height: 'calc(100vh - 99px)', overflow: 'auto' }}
                        className='bigCards'
                        rowKey="mappingsView"
                        grid={this.props.drawer ? { column: 1 } : { gutter: 12, lg: 3, md: 2, sm: 1, xs: 1 }}
                        dataSource={this.state.filterData}
                        renderItem={item =>
                            <List.Item key={item.kgIri} style={{ paddingBottom: 6 }}>
                                <Card hoverable>
                                    <div onClick={() => this.props.open(item.kgIri)}>
                                        {this.props.drawer ?
                                            <div>
                                                <Card.Meta key={item.kgIri}
                                                    title={<div>{item.kgTitle[0].content}<br />{item.kgIri}</div>}
                                                    description={item.kgDescriptions[0].content}
                                                />
                                                <div className='ant-card-meta-description'>{moment(item.kgLastModifiedTs).format(dateFormat)}</div>
                                            </div> :
                                            <NavLink to={"/open/kg/info"}>
                                                <Card.Meta key={item.kgIri}
                                                    title={<div>{item.kgTitle[0].content}<br />{item.kgIri}</div>}
                                                    description={item.kgDescriptions[0].content}
                                                />
                                            </NavLink>
                                        }
                                    </div>
                                    <div className='card-bottom'>
                                        <div>
                                            {moment(item.kgCreationTs).format(dateFormat)}
                                        </div>
                                        <div className='card-actions'>
                                            <Popover trigger="click" content={
                                                <div>
                                                    <p>{item.kgTriples + " triples"}</p>
                                                </div>
                                            } placement="bottom">
                                                <Icon type="info-circle" theme="filled" />
                                            </Popover>
                                            <span className='delete-icon' style={{ paddingLeft: 12 }} onClick={
                                                () => this.setState({ modalVisible: true, toDelete: item })
                                            }>
                                                <Icon type="delete" theme="filled" />
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </List.Item>
                        }
                    />
                </div>
        );
    }
}