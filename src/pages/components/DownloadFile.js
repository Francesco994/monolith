import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { downloadOntologyFile, downloadMappingFile, getGraphol } from '../../api/MastroApi';
import { saveFileInfo } from '../../utils/utils'
import { downloadKnowledgeGraph } from '../../api/KgApi';

const formats = {
  F: 'Functional Syntax',
  R: 'RDF/XML',
  T: 'Turtle'
}

export default class DownloadFile extends React.Component {


  download = (e) => {
    if (e.key.startsWith('owl'))
      downloadOntologyFile(this.props.ontology.name, this.props.ontology.version, formats[e.key.slice(-1)], false, saveFileInfo)
    else if (e.key === 'graphol')
      getGraphol(this.props.ontology.name, this.props.ontology.version, saveFileInfo)
    else if (e.key.startsWith('dllite'))
      downloadOntologyFile(this.props.ontology.name, this.props.ontology.version, formats[e.key.slice(-1)], true, saveFileInfo)
    else if (e.key === 'xml')
      downloadMappingFile(this.props.ontology.name, this.props.ontology.version, this.props.mapping, saveFileInfo)
    else if (e.key === 'rdf')
      downloadKnowledgeGraph(this.props.kg.kgIri, "RDF/XML", saveFileInfo)
    else if (e.key === 'ntriples')
      downloadKnowledgeGraph(this.props.kg.kgIri, "N-TRIPLE", saveFileInfo)
  }

  render() {
    let menuItems = []
    if (this.props.mapping) {
      menuItems.push(<Menu.Item key='xml'>XML</Menu.Item>)
      menuItems.push(<Menu.Item key='r2rml'>R2RML</Menu.Item>)
    }
    else if (this.props.ontology) {
      menuItems.push(<Menu.SubMenu title="OWL" key='owl'>
          <Menu.Item key='owlF'>Functional Syntax</Menu.Item>
          <Menu.Item key='owlR'>RDF/XML</Menu.Item>
          <Menu.Item key='owlT'>Turtle</Menu.Item>
        </Menu.SubMenu>)
      menuItems.push(<Menu.Item key='graphol'>GRAPHOL</Menu.Item>)
      menuItems.push(<Menu.SubMenu title="OWL (approximated)" key='dllite'>
          <Menu.Item key='dlliteF'>Functional Syntax</Menu.Item>
          <Menu.Item key='dlliteR'>RDF/XML</Menu.Item>
          <Menu.Item key='dlliteT'>Turtle</Menu.Item>
        </Menu.SubMenu>)
      
    }
    else if (this.props.kgInstance) {
      menuItems.push(<Menu.Item key='rdfInstance'>RDF/XML</Menu.Item>)
      menuItems.push(<Menu.Item key='ntriplesInstance'>NTRIPLES</Menu.Item>)
      menuItems.push(<Menu.Item key='n3Instance'>N3/Turtle</Menu.Item>)

    }
    else if (this.props.kg) {
      menuItems.push(<Menu.Item key='rdf'>RDF/XML</Menu.Item>)
      menuItems.push(<Menu.Item key='ntriples'>NTRIPLES</Menu.Item>)
    }

    const menu = <Menu onClick={this.download} theme='dark'>
      {menuItems}
    </Menu>

    return (
      <div style={{ margin: 'auto' }}>
        <Dropdown overlay={menu}>
          <Button type='primary' icon='download'>
            {this.props.title || 'Download'}
          </Button>
        </Dropdown>
      </div>

    );
  }
}
