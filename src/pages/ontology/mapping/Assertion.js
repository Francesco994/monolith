import React from 'react';
import { Card } from 'antd'
import MappingBody from './MappingBody';
import Entity from '../Entity'
import ListMapItem from '../../components/ListMapItem';

export default class Assertion extends React.Component {
    render() {
        const head = this.props.assertion.mappingHead.secondArg !== null ?
            <div>
                <div>Domain: {this.props.assertion.mappingHead.firstArg}</div>
                <div>Range: {this.props.assertion.mappingHead.secondArg}</div>
            </div> :
            this.props.assertion.mappingHead.firstArg;
        const data = [
            {
                mapKey: "Description",
                mapValue: this.props.assertion.mappingDescription
            },
            {
                mapKey: "Head",
                mapValue: <code>{head}</code>
            },
            {
                mapKey: "Body",
                mapValue: <MappingBody body={this.props.assertion.mappingBody} />
            },
        ]
        return (
            <Card className='mappingAssertion' title={this.props.entity === true &&
                <Entity entity={this.props.assertion.currentEntity} />
            } actions={!this.props.entity && [
                <span onClick={
                    () => this.props.edit(this.props.assertion)
                }>
                    edit
                </span>,
                <span onClick={
                    () => this.props.delete(this.props.assertion)
                }>
                    delete
                </span>
            ]}>
                <ListMapItem data={data} />
            </Card>
        );
    }
}
