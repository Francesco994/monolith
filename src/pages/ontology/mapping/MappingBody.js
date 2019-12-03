import React from 'react';
import { Popover } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/styles/hljs';
import sqlFormatter from 'sql-formatter'

export default class MappingBody extends React.Component {
    render() {
        const from = this.props.body.bodyFrom.map((e, i) =>
            <Popover placement='right' content={
                <SyntaxHighlighter language='sql' style={darcula}>
                    {e && sqlFormatter.format(e.sqlViewCode)}
                </SyntaxHighlighter>} key={i}>
                {e && ("\n  "+e.sqlViewID)}
                {this.props.body.bodyFrom.length !== i + 1 && ", "}
            </Popover>
        )

        return (
            <pre>
                <code style={{ color: 'rgb(186, 186, 186)' }}>
                    <span style={{ color: 'rgb(203, 120, 50)' }}>select</span> {"\n  " + this.props.body.bodySelect} <br />
                    <span style={{ color: 'rgb(203, 120, 50)' }}>from</span> {from} <br />
                    {this.props.body.bodyWhere.length !== 0 &&
                        <div>
                            <span style={{ color: 'rgb(203, 120, 50)' }}>where</span>{"\n  " + this.props.body.bodyWhere}</div>}
                </code>
            </pre>
        );
    }
}
