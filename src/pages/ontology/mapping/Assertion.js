import React from 'react';
import { Card, Icon } from 'antd'
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
            <Card className='mappingAssertion'>  
                <Card.Meta key={this.props.assertion}
                    title={this.props.entity === true
                        ? <Entity entity={this.props.assertion.currentEntity} />
                        : <div></div>
                    }
                    description={<ListMapItem data={data} />}
                />
                {!this.props.entity && 
                    <div className='card-bottom'>
                        <div></div>
                        <div className='card-actions'>
                            <span onClick={() => this.props.edit(this.props.assertion)}>
                                <Icon type="edit" theme="filled"/>
                            </span>
                            <span className='delete-icon' style={{paddingLeft: 12}} 
                                onClick={() => this.props.delete(this.props.assertion)}>
                                <Icon type="delete" theme="filled"/>
                            </span>
                        </div>
                    </div>
                }
            </Card>
        );
    }
}
