import React from 'react'
import { NavLink } from 'react-router-dom'
import { List, Card, Popover, Spin, Icon } from 'antd';
import { getMappings, deleteMappingFile } from '../../../api/MastroApi';
import { dateFormat } from '../../../utils/utils';
import moment from 'moment'
import AddMapping from './AddMapping';

export default class LoadMappings extends React.Component {
    _isMounted = false;
    state = {
        data: [],
        loading: true
    }

    componentDidMount() {
        this._isMounted = true;
        this.requestMappings()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    requestMappings() {
        this._isMounted && this.setState({ loading: true })
        getMappings(
            this.props.ontology.name,
            this.props.ontology.version,
            this.loaded)
    }

    loaded = (data) => {
        if (data === undefined)
            data = []
        this._isMounted && this.setState({
            data: data.mappingList,
            loading: false
        });
    }

    render() {
        return (
            this.state.loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div> :

                <div>
                    <div style={{ textAlign: 'center', padding: 16 }}>
                        <h1>Mappings</h1>
                    </div>
                    <List
                        style={{ height: 'calc(100vh - 99px)', overflow: 'auto' }}
                        className='bigCards'
                        rowKey="mappingsView"
                        grid={{ gutter: 12, lg: 3, md: 2, sm: 1, xs: 1 }}
                        dataSource={['', ...this.state.data]}
                        renderItem={item =>
                            item ? (
                                <List.Item key={item.mappingID}>
                                    <Card hoverable>
                                        <NavLink to={"/open/ontology/mapping/info/" + item.mappingID}>
                                            <Card.Meta key={item.mappingID}
                                                avatar={<img alt="" src={item.avatar} />}
                                                title={item.mappingID + ' ' + item.mappingVersion}
                                                description={item.mappingDescription}
                                            />
                                        </NavLink>
                                        <div className='card-bottom'>
                                            <div>
                                                {moment(item.mappingDate).format(dateFormat)}
                                            </div>
                                            <div className='card-actions'>
                                                <Popover
                                                    content={
                                                        <div>
                                                            <p>{item.numAssertions + " assertions"}</p>
                                                            <p>{item.numViews + " views"}</p>
                                                            <p>{item.numKeyDependencies + item.numInclusionDependencies + item.numDenials + " dependencies"}</p>
                                                        </div>
                                                    }
                                                    placement="bottom"
                                                    trigger="click">
                                                    <Icon type="info-circle" theme="filled" />
                                                </Popover>
                                                <span className='delete-icon' style={{paddingLeft: 12}} onClick={
                                                    () => deleteMappingFile(
                                                        this.props.ontology.name,
                                                        this.props.ontology.version,
                                                        item.mappingID,
                                                        this.requestMappings.bind(this))
                                                }>
                                                    <Icon type="delete" theme="filled" />
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            ) : (
                                    <List.Item>
                                        {/* <UploadFile type='mapping' current={this.props.ontology} rerender={this.requestMappings.bind(this)} /> */}
                                        <AddMapping current={this.props.ontology} rerender={this.requestMappings.bind(this)}/>
                                    </List.Item>
                                )
                        }
                    />
                </div>
        );
    }
}
