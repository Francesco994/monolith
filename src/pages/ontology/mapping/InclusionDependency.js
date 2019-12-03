import React from 'react';
import { Table } from 'antd';

export default class InclusionDependency extends React.Component {
    render() {
        if(this.props.incDep.inclusionMap === null ) return null
        let data = []

        for (let item of this.props.incDep.inclusionMap){
            data.push({
                included: item.leftHandTerm,
                including: item.rightHandTerm,
            })
        }

        return (

                <Table
                    columns={[
                        { title: this.props.incDep.includedView.sqlViewID + ' (Included)', dataIndex: 'included' },
                        { title: this.props.incDep.includingView.sqlViewID + ' (Including)', dataIndex: 'including' }
                    ]}
                    rowKey={record => record.included}
                    pagination={false}
                    dataSource={data}
                />
            );
    }
}
