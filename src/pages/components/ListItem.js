import React from 'react';
import { Table, Popover } from 'antd';
import Entity from '../ontology/Entity';
import { renderEntity, predicateTypes } from '../../utils/utils';

export default class ListItem extends React.Component {
    render() {
        const propsData = this.props.data || []

        const popoverAxioms = localStorage.getItem('popoverAxioms') === 'true'

        let dataIndex = 'value'
        var data = []
        if (this.props.entity) {
            for (let i = 0; i < propsData.length; i++) {
                const entity = <Entity predicateType={this.props.predicateType} entity={propsData[i]} />
                data.push({
                    key: propsData[i].entityID,
                    value: popoverAxioms && this.props.axiom ?
                        <Popover content={
                            <code>
                                {this.props.axiom.first &&
                                    `${renderEntity(this.props.axiom.first)} ${this.props.axiom.owl}: ${renderEntity(propsData[i])}`}
                                {this.props.axiom.second &&
                                    `${renderEntity(propsData[i])} ${this.props.axiom.owl}: ${renderEntity(this.props.axiom.second)}`}
                            </code>
                        }>
                            <div>{entity}</div>
                        </Popover> :
                        entity
                })
            }

        }
        else if (this.props.partecipation) {
            for (let i = 0; i < propsData.length; i++) {
                const entity = <Entity predicateType={this.props.predicateType} entity={propsData[i].property} />
                data.push({
                    key: propsData[i].property.entityID,
                    value: popoverAxioms ?
                        <Popover content={
                            <code>
                                {(this.props.predicateType === predicateTypes.op || this.props.predicateType === predicateTypes.dp) &&
                                    `${renderEntity(this.props.axiom.first)} ${this.props.axiom.owl}: ${propsData[i].filler.entityIRI === "http://www.w3.org/2002/07/owl#Thing" ?
                                        'some ' + renderEntity(propsData[i].property) :
                                        'only ' + renderEntity(propsData[i].filler)}}`}
                            </code>
                        }>
                            <div>{entity}</div>
                        </Popover> :
                        entity
                })
            }
        }
        else if (this.props.union) {
            for (let i = 0; i < propsData.length; i++) {
                data.push({
                    key: propsData[i][0].entityID + '_' + propsData[i][1].entityID,
                    value: <div>
                        <Entity predicateType={this.props.predicateType} entity={propsData[i][0]} />
                        <br />
                        <Entity predicateType={this.props.predicateType} entity={propsData[i][1]} />
                    </div>
                })
            }
        }
        else if (this.props.label) {
            for (let i = 0; i < propsData.length; i++) {
                data.push({
                    key: i,
                    value: propsData[i].content,
                })
            }

        }
        // string
        else {
            for (let i = 0; i < propsData.length; i++) {
                data.push({
                    key: i,
                    value: <div>
                        {popoverAxioms && this.props.axiom ?
                            <Popover content={
                                <code>
                                    {`${propsData[i]}${this.props.axiom.type}(${renderEntity(this.props.axiom.entity)})`}
                                </code>
                            }>
                                {propsData[i]}
                            </Popover> :
                            propsData[i]
                        }
                    </div>,
                })
            }

        }

        // console.log(data)

        return (
            <Table
                columns={[{ dataIndex: dataIndex }]}
                showHeader={false}
                pagination={false}
                dataSource={data}
            />
        );
    }
}
