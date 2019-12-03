import React from 'react';
import { Table } from 'antd';

export default class ListMapItem extends React.Component {
    render() {
        if(this.props.data === undefined) return null

        return (

            <Table
                columns={[{ dataIndex: 'mapKey', width: 200 }, { dataIndex: 'mapValue' }]}
                rowKey={record => record.mapKey}
                showHeader={false}
                pagination={false}
                dataSource={this.props.data}
            />
        );
    }
}
