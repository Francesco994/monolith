import React from 'react';
import { Button, Progress, List, Modal } from 'antd';
import YASQE from 'yasgui-yasqe'
import '../../css/yasqe.min.css'
import { Input } from 'antd';
// import Results from './ResultsInfiniteList';
// import Results from './ResultsGriddle';
import Results from './KnowledgeGraphResultsTable'
import {
    startQuery,
    getQueryStatus,
    startNewQuery,
    postInQueryCatalog,
    putInQueryCatalog,
} from '../../api/KgApi';

const { TextArea } = Input;

const POLLING_TIME = 1000

export default class KnowledgeGraphSPARQLTabPane extends React.Component {
    state = {
        modalVisible: false,
        modalConfirmLoading: false,
        new: true,
        dirty: false,
        validID: true,
        // QUERY STATUS
        queryID: null,
        loading: false,
        status: {},
        interval: 0,
    }

    componentWillUnmount() {
        this.stopPolling()
    }

    componentDidMount() {
        this.setState({
            tabKey: this.props.tabKey,
            queryID: this.props.query.queryID,
            new: this.props.new,
        })
        /** INITIALIZE YASQE */
        this.changeDescription({ target: { value: this.props.query.queryDescription } })
        this.yasqe = YASQE(document.getElementById('sparql_' + this.props.num),
            {
                // Disable share link
                createShareLink: null,
                sparql: {
                    // Disable query execution button
                    showQueryButton: false
                },
                persistent: null
            });

        if (this.props.query.queryCode !== undefined) {
            this.yasqe.setValue(this.props.query.queryCode)
            // this.yasqe.collapsePrefixes(true)
        }
        else
            this.yasqe.setValue("")

        this.yasqe.on('change', () => {
            if (!this.state.dirty) {
                this.props.setDirty(this.state.tabKey)
                this.setState({ dirty: true })
            }
            // console.debug(this.yasqe.getQueryType())
        })
        this.yasqe.refresh();

        if (this.props.executionID) {
            this.startPolling(this.props.executionID)
        }
    }

    componentDidUpdate() {
        this.yasqe.refresh();
    }

    loadedPrefixes = (prefixes) => {
        if (true) return
        let yPrefixes = {}
        for (let prefix of prefixes) {
            let p = prefix.name
            yPrefixes[p.substring(0, p.length - 1)] = prefix.namespace
        }
        this.yasqe.addPrefixes(yPrefixes)
        this.yasqe.collapsePrefixes(true)

    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    }

    showOverwriteModal = () => {
        this.setState({
            overwirteModalVisible: true,
        });
    }

    handleOk = () => {
        this.setState({
            modalConfirmLoading: true,
        });
        this.save()
    }

    handleOkOverwrite = () => {
        const query = {
            queryID: this.state.queryID,
            queryDescription: this.state.queryDescription || '',
            queryCode: this.yasqe.getValue()
        }
        putInQueryCatalog(
            this.props.kg.kgIri,
            query,
            () => {
                this.props.renameTab(this.state.tabKey, this.state.queryID)
                this.setState({
                    modalVisible: false,
                    overwirteModalVisible: false,
                    modalConfirmLoading: false,
                    new: false,
                    dirty: false,
                })
            })
    }

    handleCancel = () => {
        this.setState({
            modalVisible: false,
            modalConfirmLoading: false
        });
    }

    handleCancelOverwrite = () => {
        this.setState({
            overwirteModalVisible: false,
            modalConfirmLoading: false
        });
    }

    start() {
        if (!this.state.new && !this.state.dirty)
            startQuery(
                this.props.kg.kgIri,
                this.state.queryID,
                this.startPolling.bind(this))
        else {
            const query = {
                queryID: this.state.tabKey,
                queryDescription: this.state.queryDescription || '',
                queryCode: this.yasqe.getValue()
            }
            startNewQuery(
                this.props.kg.kgIri,
                query,
                this.startPolling.bind(this))
        }

    }

    stop() {
        this.stopPolling()
    }

    polling() {
        getQueryStatus(
            this.props.kg.kgIri,
            this.state.executionID,
            this.checkStatus.bind(this),
            this.stopPolling.bind(this)
        )
    }

    startPolling(executionID) {
        let qc = JSON.parse(localStorage.getItem('kgQueryCatalog')) || []
        let q = qc.filter(q => q.tab === this.state.tabKey)[0]
        if (q)
            q['executionID'] = executionID
        localStorage.setItem('kgQueryCatalog', JSON.stringify(qc))

        this.setState({ executionID: executionID, interval: setInterval(this.polling.bind(this), POLLING_TIME), showResults: true, loading: true })
    }

    stopPolling() {
        clearInterval(this.state.interval)
        this.setState({ loading: false })
    }

    checkStatus(status) {
        this.setState({ status: status })
        if (status.status === 'FINISHED') {
            this.stopPolling()
        }
    }

    manageError() {
        this.stopPolling()
    }

    save() {
        const query = {
            queryID: this.state.queryID,
            queryDescription: this.state.queryDescription || '',
            queryCode: this.yasqe.getValue()
        }

        const alreadyInCatalog = this.props.catalog.filter(query => query.queryID === this.state.queryID).length === 1
        if (alreadyInCatalog) {
            this.showOverwriteModal()
        }

        else if (this.state.new) {
            postInQueryCatalog(
                this.props.kg.kgIri,
                query,
                () => {
                    this.props.renameTab(this.state.tabKey, this.state.queryID)
                    this.setState({
                        modalVisible: false,
                        modalConfirmLoading: false,
                        tabKey: this.state.queryID,
                        new: false,
                        dirty: false,
                        queryID: query.queryID,

                    })

                })
        }
        else {
            putInQueryCatalog(
                this.props.kg.kgIri,
                query,
                () => {
                    this.props.renameTab(this.state.tabKey, this.state.queryID)
                    this.setState({
                        modalVisible: false,
                        modalConfirmLoading: false,
                        tabKey: this.state.queryID
                    })
                },
                //FIXME IF CANNOT PUT TRY TO CREATE NEW QUERY 
                () => postInQueryCatalog(
                    this.props.kg.kgIri,
                    query, () => {
                        this.props.renameTab(this.state.tabKey, this.state.queryID)
                        this.setState({
                            modalVisible: false,
                            modalConfirmLoading: false,
                            tabKey: this.state.queryID,
                            new: false,
                            dirty: false
                        })

                    }))
        }
    }


    changeQueryID = (e) => {
        const v = e.target.value
        const re = /^[A-Za-z][A-Za-z0-9_]*$/
        if (re.test(v)) {
            this.setState({ queryID: v, validID: true })
        }
        else {
            this.setState({ queryID: v, validID: false })
        }
    }

    changeDescription = (e) => {
        this.setState({ queryDescription: e.target.value })
    }

    render() {
        const enableRun = true
        const elements = [
            <Progress percent={this.state.status.percentage} />,
            <div id={"sparql_" + this.props.num} />,
            <TextArea
                style={{ margin: '12px 0px 12px 0px' }}
                placeholder="Description"
                autosize
                value={this.state.queryDescription}
                onChange={this.changeDescription}
            />,
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 16 }}>
                <div>
                    <Button.Group>
                        <Button
                            type="primary"
                            icon="play-circle"
                            loading={this.state.loading}
                            onClick={this.start.bind(this)}
                            disabled={!enableRun}
                        >
                            Run</Button>
                        <Button
                            type="danger"
                            icon="stop"
                            onClick={this.stop.bind(this)}
                            disabled={!this.state.loading}
                        >Stop</Button>
                    </Button.Group>
                </div>
                <Button
                    type='primary'
                    icon="save"
                    onClick={this.showModal}
                >
                    Store in catalog
                </Button>
            </div>
        ]

        if (this.state.showResults) {
            elements.push(
                <Results
                    kg={this.props.kg.kgIri}
                    executionID={this.state.executionID}
                    numberOfResults={this.state.status.numResults}
                    running={this.state.loading}
                    queryType={this.yasqe.getQueryType()}
                />)
        }

        return (
            <div style={{ padding: '0px 8px 8px 8px', height: 'calc(100vh - 81px)', overflow: 'auto' }}>
                <List
                    grid={{ gutter: 8, column: 1 }}
                    dataSource={elements}
                    renderItem={item => (
                        <List.Item>
                            {item}
                        </List.Item>
                    )}
                />
                <Modal title="Insert query ID"
                    className={!this.state.validID && 'has-error'}
                    closable={false}
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.modalConfirmLoading}
                    onCancel={this.handleCancel}
                    okButtonProps={{ disabled: !this.state.validID }}
                >
                    <Input placeholder='Specify query ID' value={this.state.queryID} onChange={this.changeQueryID} />
                    {!this.state.validID && <div className='ant-form-explain'>Not valid id: use letters numbers and underscores.</div>}
                </Modal>
                <Modal
                    closable={false}
                    visible={this.state.overwirteModalVisible}
                    onOk={this.handleOkOverwrite}
                    onCancel={this.handleCancelOverwrite}
                >
                    Overwrite query?
                </Modal>
            </div>
        );
    }
}

