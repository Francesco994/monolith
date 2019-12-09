import React from 'react';
import { Form, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { postMappingViews, putMappingView } from '../../../api/MastroApi';


class AddSQLViewForm extends React.Component {
    componentDidMount() {
        if (this.props.sqlView) {
            const values = this.props.sqlView
            this.props.form.setFieldsValue({
                name: values.sqlViewID,
                description: values.sqlViewDescription,
                code: values.sqlViewCode
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const sqlView = {
                    sqlViewID: values.name,
                    sqlViewDescription: values.description,
                    sqlViewCode: values.code
                }
                if (this.props.sqlView.sqlViewID)
                    putMappingView(
                        this.props.ontology.name,
                        this.props.ontology.version,
                        this.props.mappingID,
                        this.props.sqlView.sqlViewID,
                        sqlView,
                        this.props.success);
                else
                    postMappingViews(
                        this.props.ontology.name,
                        this.props.ontology.version,
                        this.props.mappingID,
                        sqlView,
                        this.props.success);
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{ maxWidth: 800 }}>
                <Form.Item label='Name'>
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: 'Please select sql view name',
                        }],
                    })(
                        <TextArea autoSize={{ minRows: 1 }} />
                    )}
                </Form.Item>
                <Form.Item label='SQL Code'>
                    {getFieldDecorator('code', {
                        rules: [{
                            required: true, message: 'Please select sql view name',
                        }],
                    })(
                        <TextArea autoSize={{ minRows: 8 }} />
                    )}
                </Form.Item>
                <Form.Item label='Description'>
                    {getFieldDecorator('description', {
                        rules: [{
                            required: false,
                        }],
                    })(
                        <TextArea autoSize={{ minRows: 1 }} />
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        )
    }
}
const WrappedSQLViewForm = Form.create({ name: 'visit' })(AddSQLViewForm);

export default WrappedSQLViewForm