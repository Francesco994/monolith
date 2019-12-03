import React from 'react';
import UploadFile from '../components/UploadFile';
import { List, Card, Icon, Button, Modal, Radio, Input, Spin, message, } from 'antd';
import { dateFormat } from '../../utils/utils';
import { getKnowledgeGraphFiles, putUploadedKnowledgeGraphFile, getKnowledgeGraphStatus, deleteKnowledgeGraphFile } from '../../api/KgApi';
const moment = require('moment')

const namedGraphValues = [
    'FROM_DATA',
    'DEFAULT',
    'CUSTOM'
]

export default class ImportKnowledgeGraphRDF extends React.Component {
    state = {
        selected: new Set(),
        visible: false,
        modalRadioValue: namedGraphValues[0],
        modalNamedGraphValue: '',
        data: [],
        loading: true,
        intervalImport: 0,
        import: false
    }

    componentDidMount() {
        getKnowledgeGraphFiles(this.props.kg.kgIri, this.loaded)
    }

    loaded = (data) => {
        this.setState({ data, loading: false })
    }

    selectCard(fileName) {
        let selected = Object.assign(this.state.selected)

        if (selected.has(fileName)) {
            selected.delete(fileName)
        }
        else {
            selected.add(fileName)
        }

        this.setState({ selected })
    }

    showModal = () => {
        this.setState({ visible: true })
    }

    singleImport(fileName) {
        let selected = new Set()
        selected.add(fileName)
        this.setState({ selected, visible: true })
    }

    singleDelete(fileName) {
        let selected = new Set()
        selected.add(fileName)
        deleteKnowledgeGraphFile(this.props.kg.kgIri, [...selected], () => {
            message.success("deleted")
            getKnowledgeGraphFiles(this.props.kg.kgIri, this.loaded)
        })
    }

    deleteFiles = () => {
        deleteKnowledgeGraphFile(this.props.kg.kgIri, [...this.state.selected], () => {
            message.success("deleted")
            getKnowledgeGraphFiles(this.props.kg.kgIri, this.loaded)
        })
    }

    onChangeModalRadio = (e) => {
        this.setState({ modalRadioValue: e.target.value })
    }

    onChangeModalInputNamedGraph = (e) => {
        this.setState({ modalNamedGraphValue: e.target.value })
    }

    resetStatus = () => {
        this.setState({ selected: new Set() })
    }

    submit = () => {
        const namedGraph = this.state.modalRadioValue === namedGraphValues[2] ? this.state.modalNamedGraphValue : this.state.modalRadioValue

        const kgFileDestination = {
            kgDestination: {
                destination: this.props.kg.kgIri,
                namedGraph
            },
            fileNames: [...this.state.selected]
        }
        putUploadedKnowledgeGraphFile(kgFileDestination, this.startPolling)
    }

    startPolling = () => {
        this.setState({ importing: true, intervalImport: setInterval(this.polling.bind(this), 1000) })
    }

    stopPolling() {
        clearInterval(this.state.intervalImport)
        this.setState({ importing: false, intervalImport: 0, visible: false })
    }

    polling() {
        getKnowledgeGraphStatus(
            this.props.kg.kgIri,
            this.checkStatus.bind(this))
    }

    checkStatus(status) {
        if (status.status === 'READY') {
            getKnowledgeGraphFiles(this.props.kg.kgIri, this.loaded)
            this.stopPolling()
        }
    }

    render() {

        return (
            this.state.loading ?
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}>
                    <Spin size='large' />
                </div> :
                <div>
                    <Modal
                        title='Import Settings'
                        closable={false}
                        visible={this.state.visible}
                        onOk={this.submit}
                        confirmLoading={this.state.importing}
                        onCancel={() => this.setState({ visible: false })}>
                        <div>
                            <p>{`Import rdf files into ${this.props.kg.kgIri}`}</p>
                            <ul>
                                {[...this.state.selected].map(item => <li key={item}>{item}</li>)}
                            </ul>
                            <Radio.Group onChange={this.onChangeModalRadio} value={this.state.modalRadioValue}>
                                <Radio value={namedGraphValues[0]}>From data</Radio>
                                <Radio value={namedGraphValues[1]}>The default graph</Radio>
                                <Radio value={namedGraphValues[2]}>Named graph</Radio>
                            </Radio.Group>
                            <Input
                                disabled={this.state.modalRadioValue !== namedGraphValues[2]}
                                placeholder='http://example.com/graph'
                                value={this.state.modalNamedGraphValue}
                                onChange={this.onChangeModalInputNamedGraph}
                            />
                        </div>

                    </Modal>
                    <div style={{ textAlign: 'center', padding: 6 }}>
                        <h1>Import in Knowledge Graph</h1>
                    </div>
                    <div style={{ height: 44, padding: 6 }}>
                        {this.state.selected.size > 0 && <div style={{ display: 'flex' }}>
                            <Button style={{ marginRight: 6 }} onClick={this.showModal}>
                                Import
                            </Button>
                            <Button style={{ marginRight: 6 }} onClick={this.resetStatus}>
                                Reset Status
                            </Button>
                            <Button onClick={this.deleteFiles}>
                                Delete
                            </Button>
                        </div>}
                    </div>
                    <List
                        style={{ height: 'calc(100vh - 99px)', overflow: 'auto' }}
                        className='bigCards'
                        rowKey="mappingsView"
                        grid={this.props.drawer ? { column: 1 } : { gutter: 12, lg: 3, md: 2, sm: 1, xs: 1 }}
                        dataSource={['', ...this.state.data]}
                        renderItem={item =>
                            item ? (
                                <List.Item key={item.fileName} style={{ paddingBottom: 6 }}>
                                    <Card
                                        hoverable
                                        style={this.state.selected.has(item.fileName) ?
                                            { backgroundColor: 'var(--highlight-gray)' } : {}}
                                        actions={[
                                            <span
                                                onClick={() => this.singleImport(item.fileName)}>
                                                import
                                            </span>,
                                            <span
                                                onClick={() => this.singleDelete(item.fileName)}>
                                                delete
                                            </span>
                                        ]}>
                                        <div
                                            onClick={() => this.selectCard(item.fileName)}>
                                            <div>
                                                <Card.Meta
                                                    avatar={item.imported &&
                                                        <Icon
                                                            style={{ fontSize: '2em', color: 'var(--highlight)' }}
                                                            type="check-circle" />}
                                                    key={item.fileName}
                                                    title={item.fileName}
                                                    description={item.imported &&
                                                        `Imported ${item.numberOfTriples} in ${item.importingTime} ms`}
                                                />
                                                <div className='ant-card-meta-description'>
                                                    {moment(item.uploadDate).format(dateFormat)}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            ) : (
                                    <List.Item>
                                        <UploadFile type='kg' current={this.props.kg} rerender={() => getKnowledgeGraphFiles(this.props.kg.kgIri, this.loaded)} />
                                    </List.Item>
                                )
                        }
                    />
                </div>
        )
    }
}