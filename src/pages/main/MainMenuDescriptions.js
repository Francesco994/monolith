import React from 'react';
import { NavLink } from 'react-router-dom'
import { List, Card, Icon, Divider } from 'antd';

const data = [
    {
        icon: <Icon type="block" />,
        title: 'Ontology',
        link: 'ontology',
        description: 'Here you can load an ontology (OWL file)'
    },
    {
        icon: <Icon type="deployment-unit" />,
        title: 'Knowledge Graph',
        link: 'kg',
        description: 'Here you can load a knowledge graph '
    },
    {
        icon: <Icon type="table" />,
        title: 'Dataset',
        link: 'dataset',
        description: 'Here you can load a dataset'
    },
];

export default class MainMenuDescriptions extends React.Component {
    render() {
        
        return (
            <div>
                <Divider>Help</Divider>
                <List
                    className='bigCards'
                    grid={{ gutter: 16, lg: 3, md: 2, sm: 1, xs: 1 }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <NavLink to={item.link}>
                                <Card hoverable >
                                    <Card.Meta avatar={item.icon} title={item.title} description={item.description} />
                                </Card>
                            </NavLink>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
