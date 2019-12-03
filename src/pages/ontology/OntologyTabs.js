import React from 'react';
import { Card } from 'antd';

export default class OntologyTabs extends React.Component {
    state = {
        tabKey: this.props.titles[0].key,
    }

    onTabChange = (key, type) => {
        // console.log(key, type);
        this.setState({ [type]: key });
    }

    render() {

        const tabList = this.props.titles;
        return (
            <div>
                <Card
                    style={{ width: '100%' }}
                    tabList={tabList}
                    activeTabKey={this.state.tabKey}
                    onTabChange={(key) => { this.onTabChange(key, 'tabKey'); }}
                >
                    <div style={{ width: '100%', height: '40vh', overflow: 'auto' }}>
                        {this.props.data[this.state.tabKey]}
                    </div>
                </Card>
            </div>
        );
    }
}
