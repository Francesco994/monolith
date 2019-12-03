import React from 'react'
import GrapholScape from '../../lib/grapholscape/dist/grapholscape.js'
import { toggle, search } from '../../lib/grapholscape/dist/grapholscape.js'
import '../../lib/grapholscape/style/style.css'
import '../../lib/material-icons/MaterialIcons.css'
import '../../css/grapholscape.css'
import { getGraphol } from '../../api/MastroApi.js';

export default class Graphol extends React.Component {
    componentDidMount() {
        getGraphol(this.props.ontology.name, this.props.ontology.version, this.loaded)
    }

    loaded = (grapholFileInfo) => {
        var graph = new GrapholScape(null, document.getElementById('grapholscape-container'), atob(grapholFileInfo.content));
        var selectedDiagram = graph.getDiagramName(0);
        graph.drawDiagram(selectedDiagram);
        let btns = document.getElementsByClassName('module_button')
        for (let i = 0; i < btns.length; i++) {
            let btn = btns.item(i)
            btn.onclick = () => toggle(btn)
        }
        btns = document.getElementsByClassName('bottom_button')
        for (let i = 0; i < btns.length; i++) {
            let btn = btns.item(i)
            btn.onclick = () => toggle(btn)
        }

        let input = document.getElementById("search")
        input.onkeyup = () => search(input.value)
    }

    render() {
        return (
            <div style={{ borderRadius: 10, border: 'solid white 10px', background: 'white', margin: 8 }}>
                <div id="grapholscape-container" style={{ position: "relative", height: "calc(100vh - 61px)" }} />
            </div>
        )
    }
}