import React from 'react';
import { Select, Popover, Button, Icon, } from 'antd';
import { getDatasources } from '../../../api/MastroApi';

const Option = Select.Option;

export default class MappingSelector extends React.Component {

    state = {
        datasources: []
    }

    componentDidMount() {
        getDatasources((data) => this.setState({ datasources: data.map(i => i.id) }))
    }

    getOptions(item) {

        const running = this.props.runningMappingIDs.includes(item.mappingID)

        const style = running ? { color: '#52c41a' } : {}

        return <Option value={item.mappingID} key={item.mappingID}>
            <Popover content={
                <div>
                    <p>{item.mappingID + ' ' + item.mappingVersion}</p>
                    <small>{item.mappingDescription}</small>
                </div>
            } placement='right'>
                <div className='mapping' style={style}>
                    {running && <Icon type='thunderbolt' style={{ paddingRight: 4 }} />}
                    {item.mappingID}
                </div>
            </Popover>
        </Option>
    }



    select = (value) => {
        const enableStart = !this.props.runningMappingIDs.includes(this.props.selected);
        this.props.onSelection(value, enableStart)
    }

    selectDatasource = (value) => {
        this.props.onSelectionDatasource(value)
    }

    render() {
        if (this.props.mappings[0] === undefined) return null
        const mappings = this.props.mappings.map(item => this.getOptions(item));
        const disableStart = this.props.runningMappingIDs.includes(this.props.selected);
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center' }}>

                    <h3>Choose mapping:</h3>
                    <Select
                        style={{ paddingLeft: 8 }}
                        defaultValue={
                            this.props.mappings[0].mappingID
                        }
                        onChange={this.select}
                        disabled={this.props.loadingMastro}>
                        {mappings}
                    </Select>

                    <Select
                        style={{ paddingLeft: 8, width: 200 }}
                        placeholder='Choose datasource'
                        onChange={this.selectDatasource}
                        disabled={this.props.loadingMastro}>
                        {this.state.datasources.map(i => <Option value={i} key={i}>{i}</Option>)}
                    </Select>

                    <Button.Group style={{ margin: '0px 10px' }}>
                        <Button
                            type="primary"
                            icon="play-circle"
                            loading={this.props.loadingMastro}
                            onClick={this.props.startMastro}
                            disabled={disableStart}
                        >
                            Start Mastro
                        </Button>
                        <Button
                            type="danger"
                            icon="stop"
                            onClick={this.props.stopMastro}
                            disabled={!disableStart}
                        >
                            Stop Mastro
                        </Button>
                    </Button.Group>
                </div>
            </div>


        )
    }
}
