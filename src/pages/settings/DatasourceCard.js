import React from 'react'
import { Card, Icon } from "antd";
import ListMapItem from "../components/ListMapItem";


export default class DatasourceCard extends React.Component {
    state = {
        showPassword: false
    }
    render() {
        return (
            <Card hoverable actions={[
                <span onClick={() => this.props.open(this.props.datasource.id)}>edit</span>,
                <span onClick={() => this.props.delete(this.props.datasource.id)}>delete</span>,
            ]}>
                <Card.Meta key={this.props.datasource.id}
                    title={this.props.datasource.id}
                    description={this.props.datasource.description ?
                        this.props.datasource.description :
                        <div className='disabled'>No description</div>
                    }
                    style={{ height: 'unset', paddingBottom: 12 }}
                />
                <ListMapItem data={
                    [
                        {
                            mapKey: "Driver",
                            mapValue: this.props.datasource.jdbcDriver
                        },
                        {
                            mapKey: "URL",
                            mapValue: this.props.datasource.jdbcUrl
                        },
                        {
                            mapKey: "User",
                            mapValue: this.props.datasource.jdbcUsername
                        },
                        {
                            mapKey: "Password",
                            mapValue: <div>
                                <span>{this.state.showPassword ? this.props.datasource.jdbcPassword : '......'}</span>
                                <Icon
                                    type={this.state.showPassword ? 'eye-invisible' : 'eye'}
                                    style={{ float: 'right' }}
                                    onClick={() => this.setState((state) => state.showPassword = !state.showPassword)} />
                            </div>
                        },
                    ]
                } />
            </Card>
        )
    }
}