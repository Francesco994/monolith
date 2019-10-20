import React from 'react'
import {
    Form, Button, Col, Row, Input, Select, message,
} from 'antd';
import { postDatasources, getDatasourceDrivers, putDatasources } from '../api/MastroApi';


class DrawerForm extends React.Component {

    state = {
        drivers: []
    }

    componentDidMount() {
        getDatasourceDrivers(this.loaded)
        if (this.props.dataSource) {
            const ds = this.props.dataSource
            this.props.form.setFieldsValue({
                name: ds.id,
                description: ds.description,
                jdbcDriver: ds.jdbcDriver,
                jdbcUrl: ds.jdbcUrl,
                jdbcUsername: ds.jdbcUsername,
                jdbcPassword: ds.jdbcPassword
            })
        }
    }

    loaded = (drivers) => {
        this.setState({ drivers })
    }

    submit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const datasource = {
                    id: values.name,
                    description: values.description,
                    dataSourceUsername: localStorage.getItem('username'),
                    jdbcDriver: values.jdbcDriver,
                    jdbcUrl: values.jdbcUrl,
                    jdbcUsername: values.jdbcUsername,
                    jdbcPassword: values.jdbcPassword
                }
                if (this.props.dataSource)
                    putDatasources(datasource, () => {
                        message.success("Done.")
                    })
                else
                    postDatasources(datasource, () => {
                        message.success("Done.")
                    })
                this.props.rerender()
            }
        });


    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Datasource">
                                {getFieldDecorator('name', {
                                    rules: [
                                        { required: true, message: 'Please enter datasource name' },
                                        { pattern: /^[A-Za-z][A-Za-z0-9_]*$/, message: 'You can use only letters numbers and underscore.' }],
                                })(<Input placeholder="Please enter datasource name" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Description">
                                {getFieldDecorator('description', {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Please enter datasource description',
                                        },
                                    ],
                                })(<Input.TextArea rows={4} placeholder="Please enter datasource description" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="jdbc Driver">
                                {getFieldDecorator('jdbcDriver', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please enter datasource jdbc Driver',
                                        },
                                    ],
                                })(<Select placeholder='Please select jdbc driver'>
                                    {this.state.drivers.map(i => <Select.Option key={i} value={i}>{i}</Select.Option>)}
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="jdbc Url">
                                {getFieldDecorator('jdbcUrl', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please enter datasource jdbc URL',
                                        },
                                    ],
                                })(<Input placeholder="Please enter jdbc URL" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="jdbc Username">
                                {getFieldDecorator('jdbcUsername', {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Please enter datasource jdbc username',
                                        },
                                    ],
                                })(<Input placeholder="Please enter jdbc username" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="jdbc Password">
                                {getFieldDecorator('jdbcPassword', {
                                    type: 'password',
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Please enter datasource jdbc URL',
                                        },
                                    ],
                                })(<Input.Password placeholder="Please enter jdbc URL" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={this.props.rerender} style={{ marginRight: 8 }}>
                        Cancel
              </Button>
                    <Button onClick={this.submit} type="primary">
                        Submit
              </Button>
                </div>
            </div>
        );
    }
}

const DatasourceForm = Form.create()(DrawerForm);

export default DatasourceForm;