import React from 'react';
import { Table } from 'antd';

export default class ListMapItem extends React.Component {
    render() {
        if(this.props.data === undefined) return null

        let columns = []
        if(this.props.data[0].mapKey) {
            columns.push({ dataIndex: 'mapKey', width: 140 })
        }
        columns.push({ dataIndex: 'mapValue' })

        return (

            <Table
                columns={columns}
                rowKey={record => record.mapKey}
                showHeader={false}
                pagination={false}
                dataSource={this.props.data}
            />
        );
    }
}
