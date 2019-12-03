import React from 'react';
import { Table, } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/styles/hljs';
import sqlFormatter from 'sql-formatter'

export default class Denials extends React.Component {
    render() {
        if (this.props.dens === undefined || this.props.dens === null) return null
        let dataIndex = 'value'
        var data = []
        for (let i = 0; i < this.props.dens.length; i++) {
            data.push({
                key: i,
                value: <SyntaxHighlighter language='sql' style={darcula}>
                    {sqlFormatter.format(this.props.dens[i])}
                </SyntaxHighlighter>
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
