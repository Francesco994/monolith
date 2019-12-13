import React from 'react';

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import '../../css/FastSearchTree.css'


import { renderEntity, predicateTypes } from '../../utils/utils'

function convertData(node, arr, predicateType) {

  for (let item of node) {
    const children = convertData(item.children, [], predicateType)
    arr.push({
      label: renderEntity(item.entity),
      entityID: item.entity.entityID,
      predicateType: predicateType,
      children: children,
      className: predicateType,
    })
  }

  return arr.sort(function (a, b) {
    var x = a.label.toLowerCase();
    var y = b.label.toLowerCase();
    if (x < y) { return -1; }
    if (x > y) { return 1; }
    return 0;
  });
}

const onAction = ({ action, node }) => {
  console.log(`onAction:: [${action}]`, node)
}

export default class SearchTree extends React.Component {

  onChange = (currentNode, selectedNodes) => {
    if(!this.props.all) {
      this.props.onHandle(currentNode.entityID, currentNode.predicateType)
    }
    else if (currentNode._depth !== 0) {
      // console.log('onChange::', currentNode)
      this.props.onHandle(currentNode.entityID, currentNode.predicateType)
      //simulate click away to close tree
      // var click = document.createEvent("MouseEvent")
      // click.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      // document.getElementById("root").dispatchEvent(click)
    }
    // toggle expand and collapse clicking on Classes Object Properties adn Data Properties labels
    else {
      for (let node of document.getElementsByClassName('toggle collapsed')) {
        if (node.nextElementSibling.title === currentNode.label) {
          node.click()
          return;
        }
      }
      for (let node of document.getElementsByClassName('toggle expanded')) {
        if (node.nextElementSibling.title === currentNode.label) {
          node.click()
          return;
        }
      }
    }

  }


  render() {
    let data = []
    if (this.props.classes)
      data = convertData(this.props.data.hierarchyTree.classTree.children, [], predicateTypes.c)
    else if (this.props.objectProperties)
      data = convertData(this.props.data.hierarchyTree.objectPropertyTree.children, [], predicateTypes.op)
    else if (this.props.dataProperties)
      data = convertData(this.props.data.hierarchyTree.dataPropertyTree.children, [], predicateTypes.dp)
    else if (this.props.all)
      data = [
        {
          label: "Classes",
          className: 'treeRoots',
          expanded: true,
          children: convertData(this.props.data.hierarchyTree.classTree.children, [], predicateTypes.c)
        },
        {
          label: "Object Properties",
          className: 'treeRoots',
          expanded: true,
          children: convertData(this.props.data.hierarchyTree.objectPropertyTree.children, [], predicateTypes.op)
        },
        {
          label: "Data Properties",
          className: 'treeRoots',
          expanded: true,
          children: convertData(this.props.data.hierarchyTree.dataPropertyTree.children, [], predicateTypes.dp)
        }
      ]

    return <DropdownTreeSelect
      data={data}
      onChange={this.onChange}
      onAction={onAction}
      // onNodeToggle={onNodeToggle}
      className="ant-input"
      placeholderText="Search or select from entity tree"
      showDropdown='always'
    />
  }
}