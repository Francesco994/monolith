import React from 'react';
import { NavLink } from 'react-router-dom'
import { List, Card, Popover, Select, Button, Modal, Icon, Input } from 'antd';
import UploadFile from '../components/UploadFile';
import { deleteOntologyVersion } from '../../api/MastroApi';
import { dateFormat } from '../../utils/utils';
import moment from 'moment'


const Option = Select.Option
export default class OntologyVersionsList extends React.Component {
    state = {
        data: []
    }

    getData(props) {
        var list = [];
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].ontologyID === this.props.current) {
                list = [...this.props.data[i].ontologyVersions];
                break;
            }
        }
        return list;
    }

    sortByDate(a, b) {
        var x = a.versionDate;
        var y = b.versionDate;
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    }

    sortByDateD(a, b) {
        var x = a.versionDate;
        var y = b.versionDate;
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
    }

    sortByName(a, b) {
        var x = a.versionID.toLowerCase();
        var y = b.versionID.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    }

    componentDidMount() {
        this.setState({
            data: this.getData(this.props.data).sort(this.sortByDateD)
        })
    }

    // componentDidUpdate(prevProps) {
    //     this.setState({
    //         data: this.getData(props.data).sort(this.sortByDate)
    //     })
    // }


    delete(ontologyID, versionID) {
        deleteOntologyVersion(ontologyID, versionID, this.props.rerender)
        this.props.close({
            name: ontologyID,
            version: versionID
        })
    }

    changeSort = (value) => {
        if (value === 'name')
            this.setState({
                data: this.getData(this.props.data).sort(this.sortByName)
            })
        else if (value === 'date')
            this.setState({
                data: this.getData(this.props.data).sort(this.sortByDate)
            })
        else if (value === 'dateD')
            this.setState({
                data: this.getData(this.props.data).sort(this.sortByDateD)
            })
    }

    render() {

        return (
            <div>
                <Modal
                    closable={false}
                    visible={this.state.modalVisible}
                    onOk={() => this.delete(this.state.toDelete.name, this.state.toDelete.version)}
                    onCancel={() => this.setState({ modalVisible: false, toDelete: null })}
                >
                    Delete ontology version?
                </Modal>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1 style={{
                        display: 'flex',
                        justifyContent: 'center',
                        maxWidth: 700,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {`Ontology Versions for ${this.props.current}`}
                    </h1>

                </div>
                <div style={{ padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                        <Button style={{ width: 205 }} type='primary' icon='step-backward' onClick={this.props.prev}>
                            Back
                        </Button>
                        <div style={{ display: 'flex' }}>
                            <Input
                                placeholder='Search ontology...'
                                onChange={(e) => {
                                    this.setState({
                                        data: this.props.data.filter(i => i.ontologyID.toLowerCase().includes(e.target.value.toLocaleLowerCase()))
                                    })
                                }}
                                style={{ width: 576, marginRight: 6 }} />
                            <Button
                                style={{ visibility: 'hidden' }}
                                icon='plus'
                                shape='circle' />
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
                    rowKey="ontologyVersionsView"
                    grid={{ gutter: 12, lg: 3, md: 2, sm: 1, xs: 1 }}
                    dataSource={['', ...this.state.data]}
                    renderItem={item =>
                        item ? (
                            <List.Item key={item.versionID}>
                                <Card hoverable>
                                    <NavLink to={"/open/ontology/info/"} onClick={() => this.props.open(item.ontologyID, item.versionID, this.state.data)}>
                                        <Card.Meta key={item.versionID}
                                            avatar={<img alt="" src={item.avatar} />}
                                            title={
                                                <div>
                                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', direction: 'rtl', textAlign: 'left' }}>
                                                        {<span>
                                                            {/* <span>Version: </span> */}
                                                            {
                                                                item.versionID === 'NO_VERSION_PROVIDED' ?
                                                                    <span className='disabled'>No version defined</span> :
                                                                    <span>{item.versionID}</span>
                                                            }
                                                        </span>}
                                                    </div>
                                                </div>
                                            }
                                            description={item.versionDescription[0] !== undefined ? item.versionDescription[0].content : ""}
                                        />
                                    </NavLink>
                                    <div className='card-bottom'>
                                        <div>
                                            {moment(item.versionDate).format(dateFormat)}
                                        </div>
                                        <div className='card-actions'>
                                            <Popover
                                                content={
                                                    <div>
                                                        <p>{item.numClasses + " classes"}</p>
                                                        <p>{item.numObjectProperties + " object properties"}</p>
                                                        <p>{item.numDataProperties + " data properties"}</p>
                                                        <p>{item.numAxioms + " axioms"}</p>
                                                    </div>
                                                }
                                                placement="bottom"
                                                trigger="click">
                                                <Icon type="info-circle" theme="filled" />

                                            </Popover>
                                            <span className='delete-icon' style={{ paddingLeft: 12 }} onClick={
                                                () => this.setState({ modalVisible: true, toDelete: { name: item.ontologyID, version: item.versionID } })
                                            }>
                                                <Icon type="delete" theme="filled" />
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </List.Item>
                        ) : (
                                <List.Item>
                                    <UploadFile current={this.props.current} rerender={this.props.rerender} type='owl' />
                                    {/* <Button type="dashed" onClick={() => console.log("Add version of ontology")}>
                                        <Icon type="plus" />
                                        Add Ontology Version
                                    </Button> */}
                                </List.Item>
                            )
                    }
                />
            </div>
        );
    }
}
