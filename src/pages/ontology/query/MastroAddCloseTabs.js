import React from 'react';
import { Tabs, Icon, Modal } from 'antd';
import MastroSPARQLTabPane from './MastroSPARQLTabPane'

const TabPane = Tabs.TabPane;

const newQueryID = 'new_'
export default class MastroAddCloseTabs extends React.Component {
  state = {
    activeKey: null,
    panes: [],
    dirtyPanes: [],
    modalVisible: false,
    toClose: null
  };

  componentDidMount() {
    this.newTabIndex = 0;
    const props = this.props
    if (props.mappings === undefined || props.catalog === undefined) return
    const qc = JSON.parse(localStorage.getItem('mastroQueryCatalog')) || []
    if (qc) {
      this.openLastTabs(qc, props)
    }
  }

  componentWillReceiveProps(props) {
    // OPEN SELECTED TAB
    for (let i = 0; i < props.catalog.length; i++) {
      if (props.catalog[i].queryID === props.open) {
        this.add(props.catalog[i])
        break
      }
    }

  }

  componentDidUpdate(oldProps) {
    //CHECK FOR DELETION AND SET DIRTY TABS
    if (oldProps.catalog)
      for (let oq of oldProps.catalog) {
        let found = false;
        for (let q of this.props.catalog) {
          if (oq.queryID === q.queryID) {
            found = true
          }
        }
        if (!found) {
          this.state.panes.forEach(p => p.title.key === oq.queryID && this.setDirty(p.key))
        }
      }
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  renameTab = (paneKey, newTitle) => {
    let panes = [...this.state.panes]
    for (let pane of panes) {
      if (pane.key === paneKey) {
        pane.title = <span key={newTitle}><Icon type='file' />{newTitle}</span>
      }
    }

    this.setState({ panes: panes, dirtyPanes: this.state.dirtyPanes.filter(pane => pane !== paneKey) })
    this.props.refreshCatalog()
  }

  setDirty = (paneKey) => {
    if (paneKey === undefined) return
    let panes = [...this.state.panes]
    for (let pane of panes) {
      if (pane.key === paneKey) {
        pane.title = <span key={pane.title.key}><Icon type='file' />{pane.title.key + '*'}</span>
      }
    }
    let dirtypanes = [...this.state.dirtyPanes]
    if (!dirtypanes.includes(paneKey)) dirtypanes.push(paneKey)
    this.setState({ panes: panes, dirtyPanes: dirtypanes })
  }

  openLastTabs(qc, props) {
    const panes = this.state.panes;
    let activeKey = newQueryID + this.newTabIndex
    for (let q of qc) {
      const query = props.catalog.filter(query => query.queryID === q.queryID)[0]
      if (query) {
        this.newTabIndex++
        activeKey = newQueryID + this.newTabIndex
        const title = query.queryID
        panes.push({
          title: <span key={title}><Icon type='file' />{title}</span>,
          content: <MastroSPARQLTabPane
            ontology={props.ontology}
            mappings={props.mappings}
            catalog={props.catalog}
            num={activeKey}
            query={query}
            renameTab={this.renameTab}
            setDirty={this.setDirty}
            tabKey={activeKey}
            executionID={q.executionID}
          />,
          key: activeKey
        });
      }
    }
    if (panes.length === 0) {
      activeKey = newQueryID + this.newTabIndex
      const title = newQueryID + this.newTabIndex
      panes.push({
        title: <span key={title}><Icon type='file' />{title + "*"}</span>,
        content: <MastroSPARQLTabPane
          ontology={props.ontology}
          mappings={props.mappings}
          catalog={props.catalog}
          num={activeKey}
          query={{ queryID: title }}
          new
          renameTab={this.renameTab}
          setDirty={this.setDirty}
          tabKey={activeKey}
        />,
        key: activeKey
      });
    }
    this.setState({ panes, activeKey });
  }


  add = (query) => {
    const panes = this.state.panes;
    this.newTabIndex++
    const activeKey = newQueryID + this.newTabIndex
    const title = query.queryID || newQueryID + this.newTabIndex
    if (query.queryID !== undefined)
      panes.push({
        title: <span key={title}><Icon type='file' />{title}</span>,
        content: <MastroSPARQLTabPane
          ontology={this.props.ontology}
          mappings={this.props.mappings}
          catalog={this.props.catalog}
          num={activeKey}
          query={query}
          renameTab={this.renameTab}
          setDirty={this.setDirty}
          tabKey={activeKey}
        />,
        key: activeKey
      });
    else {
      panes.push({
        title: <span key={title}><Icon type='file' />{title + "*"}</span>,
        content: <MastroSPARQLTabPane
          ontology={this.props.ontology}
          mappings={this.props.mappings}
          catalog={this.props.catalog}
          num={activeKey}
          query={{ queryID: title }}
          new
          renameTab={this.renameTab}
          setDirty={this.setDirty}
          tabKey={activeKey}
        />,
        key: activeKey
      });
      this.props.openF(null)
    }
    this.setState({ panes, activeKey });
    let qc = JSON.parse(localStorage.getItem('mastroQueryCatalog')) || []
    qc.push({ queryID: query.queryID, tab: activeKey })
    localStorage.setItem('mastroQueryCatalog', JSON.stringify(qc))
  }

  remove = (targetKey) => {
    if (this.state.dirtyPanes.includes(targetKey)) {
      this.setState({ modalVisible: true, toClose: targetKey })
    }
    else {
      this.closeTab(targetKey)
    }

  }

  closeTab(targetKey) {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
      if (lastIndex === -1) {
        lastIndex = 0;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length > 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }

    if (panes.length === 0) {
      this.newTabIndex = 0
    }

    this.setState({ panes, activeKey, modalVisible: false, toClose: null });
    localStorage.setItem('mastroQueryCatalog',
      JSON.stringify(
        JSON.parse(
          localStorage.getItem('mastroQueryCatalog')
        ).filter(q => q.tab !== targetKey)
      )
    )

  }

  render() {
    return (
      <div>
        <Modal
          closable={false}
          visible={this.state.modalVisible}
          onOk={() => this.closeTab(this.state.toClose)}
          onCancel={() => this.setState({ modalVisible: false })}
        >
          Discard changes?
        </Modal>
        <Tabs
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}
        </Tabs>
      </div>
    );
  }
}
