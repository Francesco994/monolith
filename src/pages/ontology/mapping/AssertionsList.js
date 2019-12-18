import React from 'react';
import { List, Button, Drawer, Input } from 'antd';
import Assertion from './Assertion';
import AssertionForm from './AssertionForm';
import { deleteMappingAssertion } from '../../../api/MastroApi';
import { renderEntity } from '../../../utils/utils';

export default class AssertionsList extends React.Component {
    state = {
        filterData: [],
        visible: false,
        drawer: null,
    }

    componentDidMount () {
        this.setState({filterData: this.props.list})
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
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: 10}}>
                    <Input
                        placeholder={`Search by ${this.props.entity ? 'entity' : 'SQL view'}...`}
                        onChange={(e) => {
                            this.setState({
                                filterData: this.props.list.filter(i => (
                                    this.props.entity 
                                        ? renderEntity(i.currentEntity).toLowerCase().includes(e.target.value.toLowerCase()) 
                                        : i.mappingBody.bodyFrom.map(from => from.sqlViewID).join('|').toLowerCase().includes(e.target.value.toLowerCase())
                                ))
                            })
                        }}
                        style={{ width: 576, marginRight: 6 }} />
                    <Button
                        style={{ backgroundColor: 'transparent' }}
                        onClick={this.showDrawer}
                        icon='plus'
                        shape='circle' />
                </div>
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
                <List
                    style={{ padding: '0px 8px' }}
                    className='bigCards'
                    rowKey="ontologiesView"
                    grid={{ column: 2, gutter: 6 }}
                    dataSource={this.state.filterData}
                    renderItem={(item, index) =>
                        <List.Item key={index}>
                            <Assertion
                                entity={this.props.entity}
                                assertion={item}
                                edit={this.edit}
                                delete={this.delete} />
                        </List.Item>}
                />
            </div>
        );
    }
}
