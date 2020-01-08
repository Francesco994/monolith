import React from 'react';
import { List, Card, Divider, Dropdown, Menu, Icon } from 'antd';
import { NavLink } from 'react-router-dom'
import moment from 'moment';
import { dateFormat } from '../../utils/utils';
import { getMastroInstances } from '../../api/MastroApi';

export default class LastLoadedList extends React.Component {
    state = {
        mastroInstances: []
    }

    componentDidMount() {
        if (this.props.ontology) {
            getMastroInstances((mastroInstances) => this.setState({ mastroInstances }))
        }
    }

    open = (item) => {
        this.props.ontology ?
            this.props.open(item.onto.ontologyName, item.onto.ontologyVersion) :
            this.props.open(item.iri)
    }
    render() {
        return (
            <div>
                <Divider>{this.props.title}</Divider>
                <List
                    className='bigCards'
                    style={{ height: 227, overflow: 'auto' }}
                    grid={{ gutter: 12, lg: 4, md: 2, sm: 1, xs: 1 }}
                    dataSource={this.props.data}
                    renderItem={item => (
                        <List.Item style={{ paddingBottom: 6 }}>
                            <NavLink to={this.props.path} onClick={() => this.open(item)}>
                                <Card hoverable >
                                    <Card.Meta
                                        title={this.props.ontology ?
                                            item.onto.ontologyName + '-' + item.onto.ontologyVersion :
                                            item.iri}
                                        description={this.props.ontology ?
                                            item.ontologyDescription : item.description} />
                                    <div className='card-bottom'>
                                        <div>
                                            {moment(item.timestamp).format(dateFormat)}
                                        </div>
                                        <div className='card-actions'>
                                            {this.state.mastroInstances
                                                .filter(i => item.onto.ontologyName === i.ontologyID.ontologyName &&
                                                    item.onto.ontologyVersion === i.ontologyID.ontologyVersion).length > 0 &&
                                                <Dropdown trigger={['click']} overlay={
                                                    <Menu>
                                                        {this.state.mastroInstances
                                                            .filter(i => item.onto.ontologyName === i.ontologyID.ontologyName &&
                                                                item.onto.ontologyVersion === i.ontologyID.ontologyVersion)
                                                            .map(i =>
                                                                <Menu.Item key={i.mappingID}>
                                                                    <NavLink to='/open/ontology/endpoint'>
                                                                        {i.mappingID}
                                                                    </NavLink>
                                                                </Menu.Item>)}
                                                    </Menu>
                                                }>
                                                    <Icon
                                                        // style={{ fontSize: '2em', color: 'var(--highlight)' }}
                                                        type="play-circle" />
                                                </Dropdown>}
                                        </div>
                                    </div>
                                </Card>
                            </NavLink>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
