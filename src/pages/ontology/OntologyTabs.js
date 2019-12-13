import React from 'react';
import { Card, Tabs } from 'antd';

export default class OntologyTabs extends React.Component {
    render() {

        const tabList = this.props.titles;
        return (
            <div>
                <Card
                    style={{ width: '100%' }}
                    size='small'
                >
                    <Tabs size='small'>
                        {tabList.map(i => <Tabs.TabPane key={i.key} tab={i.tab}>
                            <div style={{ width: '100%', height: '40vh', overflow: 'auto' }}>
                                {this.props.data[i.key]}
                            </div>
                        </Tabs.TabPane>)}
                    </Tabs>
                </Card>
            </div>
        );
    }
}
