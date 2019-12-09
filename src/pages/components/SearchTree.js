import React from 'react';
import { Tree, Input } from 'antd';
import { getOntologyVersionHierarchy } from '../../api/MastroApi';

const { TreeNode } = Tree;
const Search = Input.Search;

function convertData(node, arr) {

  for (let item of node) {
    const children = convertData(item.children, [])
    arr.push({
      title: item.entity.entityRender,
      key: item.entity.entityID,
      children: children
    })
  }

  return arr;
}

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default class SearchTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    data: [],
    dataList: []
  }

  componentDidMount() {
    getOntologyVersionHierarchy(
      this.props.ontology.name,
      this.props.ontology.version,
      this.loaded)
  }

  componentDidUpdate(props) {
    if(props !== this.props)
      getOntologyVersionHierarchy(
        props.ontology.name,
        props.ontology.version,
        this.loaded)
  }

  loaded = (mastroData) => {
    const gData = [
      {
        title: "Classes",
        key: "Classes",
        children: convertData(mastroData.hierarchyTree.classTree.children, [])
      },
      {
        title: "Object Properties",
        key: "Object Properties",
        children: convertData(mastroData.hierarchyTree.objectPropertyTree.children, [])
      },
      {
        title: "Data Properties",
        key: "Data Properties",
        children: convertData(mastroData.hierarchyTree.dataPropertyTree.children, [])
      }
    ]

    const dataList = [];
    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({ key, title: key });
        if (node.children) {
          generateList(node.children, node.key);
        }
      }
    };
    generateList(gData);
    this.setState((state) => ({
      expandedKeys: state.expandedKeys,
      searchValue: state.searchValue,
      autoExpandParent: state.autoExpandParent,
      data: gData,
      dataList: dataList
    }))
  }

  onExpand = (expandedKeys) => {
    this.setState((state) => ({
      expandedKeys,
      autoExpandParent: false,
      data: state.data,
      dataList: state.dataList
    }));
  }

  onChange = (e) => {
    const value = e.target.value;
    const expandedKeys = this.state.dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, this.state.data);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState((state) => ({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
      data: state.data,
      dataList: state.dataList
    }));
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data => data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.children) {
        let selectable = item.key !== "Classes" && item.key !== "Object Properties" && item.key !== "Data Properties";
        return (
          <TreeNode key={item.key} title={title} selectable={selectable}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });
    return (
      <div style={{ overflow: 'auto' }}>
        <Search style={{ margin: '0px 8px 8px 0px' }} placeholder="Search for Entities" onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {loop(this.state.data)}
        </Tree>
      </div>
    );
  }
}
