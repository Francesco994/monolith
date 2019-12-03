import React from 'react';
import { Switch, Button, Progress, Popover, Modal, message } from 'antd';
import YASQE from 'yasgui-yasqe'
import '../../../css/yasqe.min.css'
import { Input } from 'antd';
// import Results from './ResultsInfiniteList';
// import Results from './ResultsGriddle';
import Results from './MastroResultsTable'
import QueryExecutionReport from './MastroQueryExecutionReport';
import MappingSelector from './MappingSelector'
import {
    startMastro as startMastroAPI,
    stopMastro as stopMastroAPI,
    getMastroStatus,
    startQuery,
    getQueryStatus,
    startNewQuery,
    postInQueryCatalog,
    putInQueryCatalog,
    getPrefixes,
    startNewConstructQuery,
    getConstructQueryStatus,
    startConstructQuery
} from '../../../api/MastroApi';

const { TextArea } = Input;

const POLLING_TIME = 1000

export default class MastroSPARQLTabPane extends React.Component {
    state = {
        showResults: false,
        modalVisible: false,
        modalConfirmLoading: false,
        reasoning: true,
        new: true,
        dirty: false,
        validID: true,
        // QUERY STATUS
        loading: false,
        selectedMappingID: null,
        status: {},
        interval: 0,
        //      MASTRO STATUS
        enabledStartMastro: true,
        loadingMastro: false,
        intervalMastro: 0,
        runningMappingIDs: []
    }

    componentWillUnmount() {
        this.stopPolling()
        this.stopPollingMastro()
    }

    componentDidMount() {
        const currMappingID = this.props.mappings[0] !== undefined && this.props.mappings[0].mappingID
        this.setState({
            tabKey: this.props.tabKey,
            queryID: this.props.query.queryID,
            new: this.props.new,
            selectedMappingID: currMappingID
        })
        this.props.mappings.forEach(mapping => {
            getMastroStatus(
                this.props.ontology.name,
                this.props.ontology.version,
                mapping.mappingID,
                this.checkMastroStatus.bind(this))
        });
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
        if (currMappingID && this.props.new) {
            getPrefixes(this.props.ontology.name, this.props.ontology.version, currMappingID, this.loadedPrefixes)
        }
        if (this.props.query.queryCode !== undefined) {
            this.yasqe.setValue(this.props.query.queryCode)
            this.yasqe.collapsePrefixes(true)
        }
        else
            this.yasqe.setValue("")
        this.yasqe.on('change', () => {
            if (!this.state.dirty) {
                this.props.setDirty(this.state.tabKey)
                this.setState({ dirty: true })
            }

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
        let yPrefixes = {}
        for (let prefix of prefixes) {
            let p = prefix.name
            yPrefixes[p.substring(0, p.length - 1)] = prefix.namespace
        }
        this.yasqe.addPrefixes(yPrefixes)
        this.yasqe.collapsePrefixes(true)
    }

    startMastro = () => {
        startMastroAPI(
            this.props.ontology.name,
            this.props.ontology.version,
            this.state.selectedMappingID,
            this.startPollingMastro.bind(this))
        this.setState({ loadingMastro: true })

    }

    stopMastro = () => {
        this.stopPollingMastro()
        stopMastroAPI(
            this.props.ontology.name,
            this.props.ontology.version,
            this.state.selectedMappingID,
            (mapId) => {
                this.setState({ runningMappingIDs: this.state.runningMappingIDs.filter(mid => mapId !== mid) })
            })
    }

    pollingMastro() {
        getMastroStatus(
            this.props.ontology.name,
            this.props.ontology.version,
            this.state.selectedMappingID,
            this.checkMastroStatus.bind(this))
    }

    startPollingMastro() {
        this.setState({ intervalMastro: setInterval(this.pollingMastro.bind(this), 1000) })
    }

    stopPollingMastro() {
        clearInterval(this.state.intervalMastro)
        this.setState({ loadingMastro: false, intervalMastro: 0 })
    }

    checkMastroStatus(status, mappingID) {
        if (status.status === 'ERROR') {
            message.error(status.lastError)
            this.stopPollingMastro()
        }

        if (status.status === 'RUNNING') {
            const newRunningMappingIDs = [...this.state.runningMappingIDs]
            if (!this.state.runningMappingIDs.includes(mappingID)) {
                newRunningMappingIDs.push(mappingID)
            }
            if (this.state.intervalMastro !== 0) {
                message.success('Mastro is running!')
            }
            this.setState({ enabledStartMastro: false, runningMappingIDs: newRunningMappingIDs })
            this.stopPollingMastro()
        }
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
        putInQueryCatalog(this.props.ontology.name, this.props.ontology.version, query, () => {
            this.props.renameTab(this.state.tabKey, this.state.queryID)
            this.setState({
                modalVisible: false,
                overwirteModalVisible: false,
                modalConfirmLoading: false,
                new: false,
                dirty: false
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

    onSelectMapping(value) {
        this.setState({ selectedMappingID: value })
    }

    start() {
        if (!this.state.new && !this.state.dirty) {
            if (this.yasqe.getQueryType() === 'CONSTRUCT') {
                startConstructQuery(
                    this.props.ontology.name,
                    this.props.ontology.version,
                    this.state.selectedMappingID,
                    this.state.queryID,
                    this.state.reasoning,
                    this.startPolling.bind(this))
            }
            else
                startQuery(
                    this.props.ontology.name,
                    this.props.ontology.version,
                    this.state.selectedMappingID,
                    this.state.queryID,
                    this.state.reasoning,
                    this.startPolling.bind(this))
        }
        else {
            const query = {
                queryID: this.state.tabKey,
                queryDescription: this.state.queryDescription || '',
                queryCode: this.yasqe.getValue()
            }
            if (this.yasqe.getQueryType() === 'CONSTRUCT') {
                query.construct = true
                startNewConstructQuery(
                    this.props.ontology.name,
                    this.props.ontology.version,
                    this.state.selectedMappingID,
                    query,
                    this.state.reasoning,
                    this.startPolling.bind(this))
            }
            else
                startNewQuery(
                    this.props.ontology.name,
                    this.props.ontology.version,
                    this.state.selectedMappingID,
                    query,
                    this.state.reasoning,
                    this.startPolling.bind(this))
        }

    }

    stop() {
        this.stopPolling()
    }

    polling() {
        if (this.yasqe.getQueryType() === 'CONSTRUCT') {
            getConstructQueryStatus(
                this.props.ontology.name,
                this.props.ontology.version,
                this.state.selectedMappingID,
                this.state.executionID,
                this.checkStatus.bind(this),
                (err) => {
                    message.error(err ? err.message : '')
                    this.stopPolling()
                })
        }
        else
            getQueryStatus(
                this.props.ontology.name,
                this.props.ontology.version,
                this.state.selectedMappingID,
                this.state.executionID,
                this.checkStatus.bind(this),
                (err) => {
                    message.error(err.message)
                    this.stopPolling()
                })

    }

    startPolling(executionID) {
        let qc = JSON.parse(localStorage.getItem('mastroQueryCatalog')) || []
        let q = qc.filter(q => q.tab === this.state.tabKey)[0]
        if (q)
            q['executionID'] = executionID
        localStorage.setItem('mastroQueryCatalog', JSON.stringify(qc))

        this.setState({
            executionID: executionID,
            interval: setInterval(this.polling.bind(this), POLLING_TIME),
            showResults: true,
            loading: true
        })
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
            queryCode: this.yasqe.getValue(),
            construct: this.yasqe.getQueryType() === 'CONSTRUCT'
        }

        const alreadyInCatalog = this.props.catalog.filter(query => query.queryID === this.state.queryID).length === 1
        if (alreadyInCatalog) {
            this.showOverwriteModal()
        }

        else if (this.state.new) {
            postInQueryCatalog(this.props.ontology.name, this.props.ontology.version, query, () => {
                this.props.renameTab(this.state.tabKey, this.state.queryID)
                this.setState({
                    modalVisible: false,
                    modalConfirmLoading: false,
                    tabKey: this.state.queryID,
                    new: false,
                    dirty: false
                })

            })
        }
        else {
            putInQueryCatalog(this.props.ontology.name, this.props.ontology.version, query, () => {
                this.props.renameTab(this.state.tabKey, this.state.queryID)
                this.setState({
                    modalVisible: false,
                    modalConfirmLoading: false,
                    tabKey: this.state.queryID
                })
            },
                //FIXME IF CANNOT PUT TRY TO CREATE NEW QUERY 
                () => postInQueryCatalog(this.props.ontology.name, this.props.ontology.version, query, () => {
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

    toggleReasoning = () => {
        this.setState({ reasoning: !this.state.reasoning })
    }

    render() {
        const enableRun = this.state.runningMappingIDs.includes(this.state.selectedMappingID)

        return (
            <div style={{ padding: '0px 8px 8px 8px', height: 'calc(100vh - 81px)', overflow: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <MappingSelector
                        mappings={this.props.mappings}
                        onSelection={this.onSelectMapping.bind(this)}
                        selected={this.state.selectedMappingID}
                        loadingMastro={this.state.loadingMastro}
                        runningMappingIDs={this.state.runningMappingIDs}
                        startMastro={this.startMastro}
                        stopMastro={this.stopMastro}
                    />
                </div>
                <Progress percent={this.state.status.percentage} />
                <div id={"sparql_" + this.props.num} />
                <TextArea
                    style={{ margin: '12px 0px 12px 0px' }}
                    placeholder="Description"
                    autosize
                    value={this.state.queryDescription}
                    onChange={this.changeDescription}
                />
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    marginBottom: 16
                }}>
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
                        <span style={{ padding: '0px 10px', color: 'rgb(255, 255, 255, 0.75)' }}>Reasoning</span>
                        <Popover content='Toggle Reasoning'>
                            <Switch checked={this.state.reasoning} onClick={this.toggleReasoning} disabled={!enableRun} />
                        </Popover>
                    </div>
                    <Button
                        type='primary'
                        icon="save"
                        onClick={this.showModal}
                    >
                        Store in catalog
                    </Button>
                </div>
                {this.state.showResults &&
                    <Results
                        ontology={this.props.ontology}
                        mappingID={this.state.selectedMappingID}
                        executionID={this.state.executionID}
                        numberOfResults={this.state.status.numResults}
                        running={this.state.loading}
                        queryType={this.yasqe && this.yasqe.getQueryType()}
                    />}
                {this.yasqe && this.yasqe.getQueryType() !== 'CONSTRUCT' &&
                    <QueryExecutionReport
                        ontology={this.props.ontology}
                        mappingID={this.state.selectedMappingID}
                        executionID={this.state.executionID}
                        running={this.state.loading}
                        status={this.state.status} />
                }
                <Modal
                    closable={false}
                    title="Insert query ID"
                    className={!this.state.validID && 'has-error'}
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.modalConfirmLoading}
                    onCancel={this.handleCancel}
                    okButtonProps={{ disabled: !this.state.validID }}
                >
                    <Input placeholder='Specify query ID' value={this.state.queryID} onChange={this.changeQueryID} />
                    {!this.state.validID && <div className='ant-form-explain'>
                        Not valid id: use letters numbers and underscores.
                    </div>}
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

