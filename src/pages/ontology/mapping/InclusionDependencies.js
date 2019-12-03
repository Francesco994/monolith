import React from 'react';
import { List, Card, } from 'antd';
import InclusionDependency from './InclusionDependency';

export default class InclusionDependencies extends React.Component {
    render() {

        return (
            <div>
                <List
                    className='bigCards'
                    grid={{ gutter: 4, column: 1 }}
                    dataSource={this.props.ids}
                    renderItem={item => (
                        <List.Item>
                            <Card>
                                <InclusionDependency incDep={item} />
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
