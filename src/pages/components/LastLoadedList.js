import React from 'react';
import { List, Card, Divider } from 'antd';
import { NavLink } from 'react-router-dom'
import moment from 'moment';
import { dateFormat } from '../../utils/utils';

export default class LastLoadedList extends React.Component {
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
                                        avatar={item.icon}
                                        title={this.props.ontology ?
                                            item.onto.ontologyName + '-' + item.onto.ontologyVersion :
                                            item.iri}
                                        description={this.props.ontology ?
                                            item.ontologyDescription : item.description} />
                                    <div className='ant-card-meta-description' style={{ float: 'right' }}>{moment(item.timestamp).format(dateFormat)}</div>
                                </Card>
                            </NavLink>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
