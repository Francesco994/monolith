import React from 'react';
import { List, Collapse } from 'antd';
import Entity from './Entity'

const Panel = Collapse.Panel;

export default class CollapsibleList extends React.Component {
    state = { activeKey: [] }

    componentDidUpdate(prevProps) {
        let props = this.props
        if (prevProps.activeKey !== this.props.activeKey) {
            var opened = props.title
            if (props.list === undefined || props.list === null || props.list.length === 0) opened = []
            this.setState({ activeKey: opened })
        }
    }

    onChange(activeKey) {
        this.setState({ activeKey });
    }

    render() {
        const list = this.props.list != null ? this.props.list : []
        return (
            <div>
                <Collapse defaultActiveKey={this.props.title} aactiveKey={this.state.activeKey} onChange={this.onChange.bind(this)}>
                    <Panel header={this.props.title} key={this.props.title} showArrow={false} >
                        <List
                            style={{ width: '100%', height: 140, overflow: 'auto' }}
                            grid={{ gutter: 0, column: 1 }}
                            dataSource={list}
                            renderItem={item => (
                                <List.Item>
                                    {Array.isArray(item) ?
                                        item.map((e, i) =>
                                            <div style={{ display: 'inline' }} key={i}>
                                                <Entity predicateType={this.props.predicateType} entity={e} />
                                                {item.length !== i + 1 && ", "/*not last one*/}
                                            </div>)
                                        :
                                        item.entityID === undefined ?
                                            item.property !== undefined ?
                                                <Entity predicateType={this.props.predicateType} entity={item.property} />
                                                :
                                                <p style={{ wordWrap: 'break-word' }}>{item}</p>
                                            :
                                            <Entity predicateType={this.props.predicateType} entity={item} />}

                                </List.Item>
                            )}
                        />
                    </Panel>
                </Collapse>

            </div>
        );
    }
}
