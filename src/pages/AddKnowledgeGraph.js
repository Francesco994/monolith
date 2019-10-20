import React from 'react'
import {
    Form, Button, Col, Row, Input, Divider, Checkbox,
} from 'antd';

import { postKnowledgeGraph } from '../api/KgApi'
import { regexIri } from '../utils/utils';

class DrawerForm extends React.Component {
    state = { showRH: true };

    submit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const publisher = {
                    agentIri: values.publisherAgentIRI,
                    agentLabels: [{ lang: '', content: values.publisherAgentLabel }],
                    agentWebsite: values.publisherAgentWebsite,
                    agentEmail: values.publisherAgentEmail,
                    agentAddress: values.publisherAgentAddress,
                }

                const kg = {
                    kgIri: values.iri,
                    kgTitle: [{ lang: '', content: values.title }],
                    kgCreator: { name: localStorage.getItem('username') },
                    kgPublisher: publisher,
                    kgContributors: [{ name: localStorage.getItem('username') }],
                    kgRightsHolder: this.state.showRH ? {
                        agentIri: values.rightsHolderAgentIRI,
                        agentLabels: [{ lang: '', content: values.rightsHolderAgentLabel }],
                        agentWebsite: values.rightsHolderAgentWebsite,
                        agentEmail: values.rightsHolderAgentEmail,
                        agentAddress: values.rightsHolderAgentAddress,
                    } : publisher,
                    kgCreationTs: Date.now(),
                    kgLastModifiedTs: Date.now(),
                    kgDescriptions: [{ lang: '', content: values.description }],
                }
                postKnowledgeGraph(kg, this.props.onClose)
            }
        });


    }

    getAgentForm(id) {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="IRI">
                            {getFieldDecorator(`${id}AgentIRI`, {
                                rules: [
                                    { required: false, message: 'Please enter agent IRI', },
                                    { pattern: regexIri, message: 'Not a valid IRI' }
                                ],
                            })(<Input placeholder='Please enter agent IRI' />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Label">
                            {getFieldDecorator(`${id}AgentLabel`, {
                                rules: [
                                    { required: false, message: 'Please enter agent label', },
                                ],
                            })(<Input placeholder='Please enter agent label' />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Website">
                            {getFieldDecorator(`${id}AgentWebsite`, {
                                rules: [
                                    { required: false, message: 'Please enter agent label', },
                                ],
                            })(<Input placeholder='Please enter agent website' />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Email">
                            {getFieldDecorator(`${id}AgentEmail`, {
                                rules: [
                                    { type: 'email', required: false, message: 'Please enter agent email', },
                                ],
                            })(<Input placeholder='Please enter agent email' />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Address">
                            {getFieldDecorator(`${id}AgentAddress`, {
                                rules: [
                                    { required: false, message: 'Please enter agent address', },
                                ],
                            })(<Input placeholder='Please enter agent address' />)}
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Knowledge Graph IRI">
                                {getFieldDecorator('iri', {
                                    rules: [
                                        { required: true, message: 'Please enter knowledge graph iri' },
                                        { pattern: regexIri, message: 'Not a valid IRI' }],
                                })(<Input placeholder="Please enter knowledge graph IRI" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Title">
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please enter knowledge graph title',
                                        },
                                    ],
                                })(<Input placeholder="Please enter knowledge graph title" />)}
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
                                            message: 'Please enter knowledge graph description',
                                        },
                                    ],
                                })(<Input.TextArea rows={4} placeholder="Please enter knowledge graph description" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider>Publisher</Divider>
                    {this.getAgentForm('publisher')}
                    <Divider>Rights Holder</Divider>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item>
                                {getFieldDecorator('sameAgents', {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Please enter knowledge graph description',
                                        },
                                    ],
                                })(
                                    <Checkbox onChange={() => this.setState({ showRH: !this.state.showRH })}>
                                        Same as Publisher
                                        </Checkbox>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    {this.state.showRH && this.getAgentForm('rightsHolder')}
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
                        background: 'var(--light)'

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

const AddKnowledgeGraph = Form.create({name: 'addKG'})(DrawerForm);

export default AddKnowledgeGraph;