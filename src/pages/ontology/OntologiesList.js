import React from 'react';
import { List, Card, Select, Modal, Icon, Input } from 'antd';
import AddOntology from './AddOntology';
import { deleteOntology } from '../../api/MastroApi';
import moment from 'moment'
import { dateFormat } from '../../utils/utils';

const Option = Select.Option

export default class OntologiesList extends React.Component {
    state = {
        data: [],
        modalVisible: false,
        toDelete: null
    }

    sortByDate(a, b) {
        var x = a.ontologyDate;
        var y = b.ontologyDate;
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    }

    sortByDateD(a, b) {
        var x = a.ontologyDate;
        var y = b.ontologyDate;
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
    }

    sortByName(a, b) {
        var x = a.ontologyID.toLowerCase();
        var y = b.ontologyID.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    }

    componentDidMount() {
        this.setState({
            data: this.props.data.sort(this.sortByDateD)
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data)
            this.setState({
                data: this.props.data.sort(this.sortByDateD)
            })
    }


    delete(ontologyID) {
        deleteOntology(ontologyID, this.props.rerender)
        this.props.close({
            name: ontologyID
        })
    }

    changeSort = (value) => {
        if (value === 'name')
            this.setState({
                data: this.state.data.sort(this.sortByName)
            })
        else if (value === 'date')
            this.setState({
                data: this.state.data.sort(this.sortByDate)
            })
        else if (value === 'dateD')
            this.setState({
                data: this.state.data.sort(this.sortByDateD)
            })
    }

    render() {
        return (
            <div>
                <Modal
                    closable={false}
                    visible={this.state.modalVisible}
                    onOk={() => this.delete(this.state.toDelete)}
                    onCancel={() => this.setState({ modalVisible: false, toDelete: null })}
                >
                    <div>
                        <div>
                            Delete ontology?
                    </div>
                        <div>
                            Warning: this operation is irreversibile and will cause all versions of the ontology to be deleted!
                        </div>
                    </div>
                </Modal>
                {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 6 }}>
                    <Button style={{ visibility: 'hidden', width: 140 }} type='primary' icon='step-backward'>
                        Back
                    </Button>
                    <h1>Ontologies</h1>
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
                </div> */}
                <h1 style={{display: 'flex', justifyContent: 'center'}}>Ontologies</h1>
                <div style={{ padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                        <div style={{ width: 205 }}></div>
                        <div style={{ display: 'flex' }}>
                            <Input 
                                placeholder='Search ontology...' 
                                onChange={(e) => {
                                    this.setState({
                                        data: this.props.data.filter(i => i.ontologyID.toLowerCase().includes(e.target.value.toLocaleLowerCase()))
                                    })
                                }} 
                                style={{ width: 576, marginRight: 6 }} />
                            <AddOntology rerender={this.props.rerender} />
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
                    style={{ height: 'calc(100vh - 79px)', overflow: 'auto' }}
                    className='bigCards'
                    rowKey="ontologiesView"
                    grid={{ gutter: 12, lg: 3, md: 2, sm: 1, xs: 1 }}
                    dataSource={this.state.data}
                    renderItem={item =>
                        <List.Item key={item.ontologyID} style={{ paddingBottom: 6 }}>
                            <Card hoverable>
                                <Card.Meta key={item.ontologyID}
                                    title={item.ontologyID}
                                    description={item.ontologyDescription}
                                    onClick={
                                        () => {
                                            this.props.next(item.ontologyID);
                                        }
                                    }
                                />
                                <div className='card-bottom'>
                                    <div>
                                        {moment(item.ontologyDate).format(dateFormat)}
                                    </div>
                                    <div className='card-actions'>
                                        <span className='delete-icon' style={{ paddingLeft: 12 }} onClick={
                                            () => this.setState({ modalVisible: true, toDelete: item.ontologyID })
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
