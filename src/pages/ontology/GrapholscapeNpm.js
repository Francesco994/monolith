import React from 'react'
import GrapholScape from 'grapholscape'
import { getGraphol } from '../../api/MastroApi.js';
import { getUrlVars } from '../../utils/utils.js';
import { Spin } from 'antd';

export default class Graphol extends React.Component {
  state = {
    loading: true
  }

  componentDidMount() {
    getGraphol(this.props.ontology.name, this.props.ontology.version, this.loaded)
  }

  loaded = (grapholFileInfo) => {
    var grapholscape = new GrapholScape(atob(grapholFileInfo.content));
    grapholscape.init(document.getElementById('grapholscape-container')).then(() => {
      grapholscape.showDiagram(0)
      let predicate = getUrlVars().iri

      if (predicate) {
        let predicates = grapholscape.ontology.getEntities()
        let node = {}
        for (node of predicates) {
          if (node.data.iri === predicate)
            break
        }
        grapholscape.controller.onNodeNavigation(node.data.id)
      }
      this.setState({ loading: false })

    })
  }

  render() {
    return (
      <div>
        {this.state.loading && <div style={{ display:'flex', justifyContent: 'center', paddingTop: 36 }}>
            <Spin size='large' />
        </div>}
        <div style={{ visibility: this.state.loading ? 'hidden' : 'visible', borderRadius: 10, border: 'solid white 10px', background: 'white', margin: 8 }}>
          <div id="grapholscape-container" style={{ position: "relative", height: "calc(100vh - 86px)" }} />
        </div>
      </div>
    )
  }
}