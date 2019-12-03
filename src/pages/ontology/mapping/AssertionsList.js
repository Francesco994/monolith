import React from 'react';
import { List, Button, Icon, Drawer } from 'antd';
import Assertion from './Assertion';
import AssertionForm from './AssertionForm';
import { deleteMappingAssertion } from '../../../api/MastroApi';

export default class AssertionsList extends React.Component {
    state = {
        visible: false,
        drawer: null,
    }

    onClose = () => {
        this.setState({ visible: false, drawer: null })
    }

    showDrawer = () => {
        this.setState({
            drawer: <AssertionForm
                ontology={this.props.ontology}
                mappingID={this.props.mappingID}
                entity={this.props.currentEntity}
                type={this.props.predicateType}
                rerender={this.props.rerender} 
                onClose={this.onClose}
                />,
            visible: true
        })
    }

    edit = (open) => {
        this.setState({
            drawer: <AssertionForm
                ontology={this.props.ontology}
                mappingID={this.props.mappingID}
                entity={this.props.currentEntity}
                type={this.props.predicateType}
                assertion={open}
                rerender={this.props.rerender} 
                onClose={this.onClose}
                />,
            visible: true
        })
    }

    delete = (assertion) => {
        deleteMappingAssertion(
            this.props.ontology.name,
            this.props.ontology.version,
            this.props.mappingID,
            assertion.id,
            this.props.rerender
        )
    }

    render() {
        let dataSource = [...this.props.list]

        if (!this.props.entity) {
            dataSource.push('')
        }

        return (
            <div>
                <List
                    style={{ padding: '0px 8px' }}
                    className='bigCards'
                    rowKey="ontologiesView"
                    grid={{ column: 2, gutter: 6 }}
                    dataSource={dataSource}
                    renderItem={(item, index) =>
                        item ?
                            <List.Item key={index}>
                                <Assertion
                                    entity={this.props.entity}
                                    assertion={item}
                                    edit={this.edit}
                                    delete={this.delete} />
                            </List.Item>
                            :
                            <List.Item key={index}>
                                <Button type='primary' style={{ height: 294, width: '100%' }} onClick={this.showDrawer}>
                                    <Icon type="plus" /> Add Ontology Mapping
                                </Button>
                                <Drawer
                                    title='Add Ontology Mapping'
                                    width='40vw'
                                    onClose={this.onClose}
                                    visible={this.state.visible}
                                    style={{
                                        overflow: 'auto',
                                    }}
                                >
                                    {this.state.drawer}
                                </Drawer>
                            </List.Item>
                    }
                />
            </div>
        );
    }
}
