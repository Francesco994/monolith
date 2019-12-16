import React from 'react';
import { Menu, Icon, Button, Upload, message } from 'antd';
import { deleteFromQueryCatalog, downloadQueryCatalog, uploadQueryCatalog } from '../../../api/MastroApi';
import { saveFileInfo, getBase64 } from '../../../utils/utils';

const MenuItem = Menu.Item;

export default class MastroQueryCatalog extends React.Component {

    downloadCatalog = () => {
        downloadQueryCatalog(
            this.props.ontology.name,
            this.props.ontology.version,
            saveFileInfo
        )
    }

    beforeUpload(file) {
        const validFormat = file.type === 'application/json';
        if (!validFormat) {
            message.error('You can only upload json files!');
        }

        else {
            getBase64(file, (file64) => {
                let json = {
                    content: file64,
                    fileType: ".owl",
                    fileName: file.name
                }

                uploadQueryCatalog(
                    this.props.ontology.name,
                    this.props.ontology.version,
                    json,
                    (success) => {
                        if (success) {
                            message.success('upload successfully.');
                            this.props.refreshCatalog()
                        }
                    })
            })
        }
        return false;
    }


    getClosableMenuItem(item) {
        return (
            <MenuItem className='catalogQuery' key={item}>
                {/* <Link to={'/open/ontology/endpoint/' + item}> */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }} onClick={() => this.props.open(item)}>{item}</div>
                    {!this.props.collapsed && <span style={{ float: "right" }} onClick={() => deleteFromQueryCatalog(
                        this.props.ontology.name,
                        this.props.ontology.version,
                        item,
                        this.props.refreshCatalog
                    )}>
                        <Icon type="minus-circle" />
                    </span>}
                </div>
                {/* </Link> */}
            </MenuItem>
        );
    }

    render() {
        const h = !this.props.collapsed ? 120 : 80
        return (
            <div>
                {!this.props.collapsed && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 8, }}>
                    <h3 style={{ margin: '0px 0px 0px 16px' }}>Query Catalog</h3>
                    <div>
                        <Button style={{ margin: '0px 4px' }} ghost size='small' shape='circle' icon='download' onClick={this.downloadCatalog} />
                        <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={[]}>
                            <Button ghost size='small' shape='circle' icon='upload' />
                        </Upload>
                    </div>
                </div>}
                <Menu style={{ backgroundColor: 'transparent', height: `calc(100vh - ${h}px)`, overflow: 'auto' }} theme='dark' mode="inline">
                    {this.props.catalog && this.props.catalog.map(item => this.getClosableMenuItem(item.queryID))}
                </Menu>

            </div>
        )
    }
}
