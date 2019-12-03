import React from 'react';
import { Card } from 'antd';
import ListMapItem from '../components/ListMapItem';
import ListItem from '../components/ListItem';

export default class MetricsTabs extends React.Component {
    state = {
        tabKey: this.props.titles[0].key,
    }

    onTabChange = (key, type) => {
        // console.log(key, type);
        this.setState({ [type]: key });
    }

    render() {

        const tabList = this.props.titles;
        const data = this.props.data;

        const contentList = {};
        for (let key in data) {
            if(key === 'imports') contentList[key] = <ListItem data={data[key]} />
            else contentList[key] = <ListMapItem data={data[key]} />
        }

        return (
            <div>
                <Card
                    style={{ width: '100%' }}
                    tabList={tabList}
                    activeTabKey={this.state.tabKey}
                    onTabChange={(key) => { this.onTabChange(key, 'tabKey'); }}
                >
                    <div style={{ width: '100%', height: '40vh', overflow: 'auto' }}>
                        {contentList[this.state.tabKey]}
                    </div>
                </Card>
            </div>
        );
    }
}
