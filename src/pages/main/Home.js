import React from 'react';
import LastLoadedList from '../components/LastLoadedList'
// import MainMenuDescriptions from './MainMenuDescriptions'
import logo from '../../scritta.svg'
import { isChrome } from '../../utils/utils';
import { getLastLoadedOntologies, getLastLoadedKnowledgeGraphs } from '../../api/MastroApi';
import { Spin } from 'antd';



export default class Home extends React.Component {
  state = {
    dataOntologies: [],
    dataKG: [],
    loadingOntos: true,
    loadingKgs: true
  }

  componentDidMount() {
    getLastLoadedOntologies(this.loadedOntologies)
    getLastLoadedKnowledgeGraphs(this.loadedKnowledgeGraphs)
  }

  loadedOntologies = (ontologies) => {
    this.setState({ dataOntologies: ontologies.reverse(), loadingOntos: false })
  }

  loadedKnowledgeGraphs = (kgs) => {
    this.setState({ dataKG: kgs.reverse(), loadingKgs: false })
  }

  render() {

    return (
      this.state.loadingOntos || this.state.loadingKgs ?
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div> :

        <div style={{ height: 'calc(100vh - 25px)', overflow: 'auto', padding: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={logo} alt="logo" style={isChrome ? { height: 100 } : { maxHeight: 100 }} />
          </div>
          <LastLoadedList
            ontology
            title="Recent Ontologies"
            data={this.state.dataOntologies}
            path="/open/ontology/info"
            open={this.props.openOntology} />
          <LastLoadedList
            title="Recent Knowledge Graphs"
            data={this.state.dataKG}
            path="/open/kg/info"
            open={this.props.openKg} />
          {/* {<LastLoadedList
          title="Recent Datasets"
          data={dataDataset}
          path="/dataset"
          open={() => null} />} */}
          {/* <MainMenuDescriptions /> */}
        </div>
    );
  }
}
