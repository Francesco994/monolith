import React from 'react'
import {
    Form, Button, Col, Row, Input, Select,
} from 'antd';
import { getMappingViews, postMappingAssertion, putMappingAssertion } from '../../../api/MastroApi';
import { predicateTypes } from '../../../utils/utils';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/styles/hljs';
import sqlFormatter from 'sql-formatter'

class AssertionForm extends React.Component {

    state = {
        mappingViews: []
    }

    componentDidMount() {
        getMappingViews(
            this.props.ontology.name,
            this.props.ontology.version,
            this.props.mappingID,
            this.loaded)
        if (this.props.assertion) {
            this.props.form.setFieldsValue({
                template: this.props.assertion.mappingHead.firstArg,
                domainTemplate: this.props.assertion.mappingHead.firstArg,
                rangeTemplate: this.props.assertion.mappingHead.secondArg,
                body: this.props.assertion.mappingBody.bodyFrom[0].sqlViewID

            })
        }
    }

    loaded = (mappingViews) => {
        this.setState({ mappingViews })
    }

    submit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const assertion = {
                    entityID: this.props.entity.entityID,
                    viewName: values.body,
                    template: this.props.type === predicateTypes.c ? values.template : values.domainTemplate,
                    rangeTemplate: this.props.type === predicateTypes.c ? null : values.rangeTemplate,
                }
                if (this.props.assertion) {
                    putMappingAssertion(
                        this.props.ontology.name,
                        this.props.ontology.version,
                        this.props.mappingID,
                        this.props.assertion.id,
                        assertion,
                        this.props.rerender
                    )
                }
                else
                    postMappingAssertion(
                        this.props.ontology.name,
                        this.props.ontology.version,
                        this.props.mappingID,
                        assertion,
                        this.props.rerender
                    )
            }
        });
    }

    onSelect = (value) => {
        this.setState({ selectedView: this.state.mappingViews.filter(v => v.sqlViewID === value)[0] })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout="vertical">
                    {this.props.type === predicateTypes.c &&
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Template">
                                    {getFieldDecorator('template', {
                                        rules: [
                                            { required: true, message: 'Please enter datasource name' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>}
                    {this.props.type === predicateTypes.op &&
                        <div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Domain Template">
                                        {getFieldDecorator('domainTemplate', {
                                            rules: [
                                                { required: true, message: 'Please enter datasource name' }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Range Template">
                                        {getFieldDecorator('rangeTemplate', {
                                            rules: [
                                                { required: true, message: 'Please enter datasource name' }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>}
                    {this.props.type === predicateTypes.dp &&
                        <div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Domain Template">
                                        {getFieldDecorator('domainTemplate', {
                                            rules: [
                                                { required: true, message: 'Please enter datasource name' }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Range">
                                        {getFieldDecorator('rangeTemplate', {
                                            rules: [
                                                { required: true, message: 'Please enter datasource name' }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Body">
                                {getFieldDecorator('body', {
                                    rules: [
                                        { required: true, message: 'Please enter datasource name' }],
                                })(
                                    <Select showSearch onSelect={this.onSelect}>
                                        {this.state.mappingViews.map(view => (
                                            <Select.Option value={view.sqlViewID} key={view.sqlViewID}>
                                                {view.sqlViewID}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    {this.state.selectedView && <SyntaxHighlighter language='sql' style={darcula}>
                        {sqlFormatter.format(this.state.selectedView.sqlViewCode)}
                    </SyntaxHighlighter>}
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
                    <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
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

const WrappedAssertionForm = Form.create()(AssertionForm);

export default WrappedAssertionForm;