import React from 'react';
import { Table, } from 'antd';

export default class KeyDependencies extends React.Component {
    render() {
        if (this.props.keys === undefined || this.props.keys === null) return null
        let dataIndex = 'value'
        var data = []
        for (let i = 0; i < this.props.keys.length; i++) {
            data.push({
                key: i,
                value: this.props.keys[i].keyHead,
            })
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
