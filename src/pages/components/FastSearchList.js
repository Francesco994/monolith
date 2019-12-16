import React from 'react';

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import '../../css/FastSearchTree.css'

import { getMappingViews } from '../../api/MastroApi'

function convertData(node) {
  let arr = []
  for (let item of node) {
    arr.push({
      label: item.sqlViewID
    })
  }

  return arr;
}

const onAction = ({ action, node }) => {
  console.log(`onAction:: [${action}]`, node)
}

export default class SearchTree extends React.Component {
  _isMounted = false;
  state = { data: [], loading: true }

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true })
    getMappingViews(
      this.props.ontology.name,
      this.props.ontology.version,
      this.props.mappingID,
      this.loaded)
    // document.getElementsByClassName("dropdown-trigger")[0].click()
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (!prevState.loading) {
  //     let props = this.props
  //     this.setState({ loading: true })
  //     getMappingViews(
  //       props.ontology.name,
  //       props.ontology.version,
  //       this.props.mappingID,
  //       this.loaded)
  //   }
  // }

  componentWillUnmount() {
    this._isMounted = false
  }

  onChange = (currentNode, selectedNodes) => {
    // console.log('onChange::', currentNode)
    this.props.onHandle(currentNode.label)
    //click away to close tree
    // var click = document.createEvent("MouseEvent")
    // click.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // document.getElementById("root").dispatchEvent(click)


  }

  loaded = (mastroData) => {
    this._isMounted && this.setState({ data: convertData(mastroData), loading: false })
  }

  render() {
    const data = this.state.loading ?
      [{ label: 'Loading...' }] :
      this.state.data
    return <DropdownTreeSelect
      data={data}
      onChange={this.onChange}
      onAction={onAction}
      // onNodeToggle={onNodeToggle}
      className="ant-input search-list"
      texts={{placeholder: "Choose or select SQL view"}}
      showDropdown='always'
    />
  }
}