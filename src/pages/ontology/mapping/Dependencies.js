

import React from 'react';
import { Card } from 'antd';
import KeyDependencies from './KeyDependencies';
import InclusionDependencies from './InclusionDependencies';
import Denials from './Denials';

export default class Dependencies extends React.Component {
    state = {
        tabKey: 'kds',
    }

    onTabChange = (key, type) => {
        // console.log(key, type);
        this.setState({ [type]: key });
    }

    render() {
        const tabList = [
            { key: "kds", tab: "Keys" },
            { key: "ids", tab: "Inclusions" },
            { key: "dens", tab: "Denials" },
        ];

        const contentList = {
            kds: <KeyDependencies keys={this.props.dependencies.keyDependencies} />,
            ids: <InclusionDependencies ids={this.props.dependencies.inclusionDependencies} />,
            dens: <Denials dens={this.props.dependencies.denials} />
        };

        return (
            <div>
                <Card
                    style={{ width: '100%' }}
                    tabList={tabList}
                    activeTabKey={this.state.tabKey}
                    onTabChange={(key) => { this.onTabChange(key, 'tabKey'); }}
                >
                    <div style={{ height: 340, width: '100%', overflow: 'auto' }}>
                        {contentList[this.state.tabKey]}
                    </div>
                </Card>
            </div>
        );
    }
}
