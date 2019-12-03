import React from 'react';
import { Menu, Icon, Button, Upload, message } from 'antd';
import { deleteFromQueryCatalogKg, downloadQueryCatalogKg, uploadQueryCatalogKg } from '../../api/KgApi';
import { saveFileInfo, getBase64 } from '../../utils/utils';

const MenuItem = Menu.Item;

export default class KnowledgeGraphQueryCatalog extends React.Component {

    downloadCatalog = () => {
        downloadQueryCatalogKg(
            this.props.kg,
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

                uploadQueryCatalogKg(
                    this.props.kg,
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
                    {!this.props.collapsed && <span style={{ float: "right" }} onClick={() => deleteFromQueryCatalogKg(
                        this.props.kg.kgIri,
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
        const h = !this.props.collapsed ? 87 : 47
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
                <Menu style={{ backgroundColor: 'transparent', minHeight: `calc(100vh - ${h}px)` }} theme='dark' mode="inline">
                    {this.props.catalog && this.props.catalog.map(item => this.getClosableMenuItem(item.queryID))}
                </Menu>

            </div>
        )
    }
}
