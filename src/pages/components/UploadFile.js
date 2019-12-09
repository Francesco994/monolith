import React from 'react';
import { Upload, Icon, message, Button } from 'antd';
import { uploadOntologyFile, uploadMappingFile } from '../../api/MastroApi';
import { getBase64 } from '../../utils/utils'
import { postKnowledgeGraphFile } from '../../api/KgApi';

function beforeUpload(file) {
  this.setState({ loading: true });
  if (this.props.type === 'owl') {
    const validFormat = file.name.endsWith('.owl') || file.name.endsWith('.graphol')
    if (!validFormat) {
      message.error('You can only upload OWL or GRAPHOL file! Found ' + file.type);
      this.setState({ loading: false });
    }

    else {
      getBase64(file, (file64) => {
        let json = {
          content: file64,
          fileType: file.name.endsWith('.owl') ? ".owl" : '.graphol',
          fileName: file.name
        }

        uploadOntologyFile(json, this.props.current, (success) => {
          if (success) {
            message.success('upload successfully.');
            this.props.rerender()
          }
          else this.setState({ loading: false });
        })
      })
    }
  }

  else if (this.props.type === 'mapping') {
    const validFormat = file.type === 'text/xml';
    if (!validFormat) {
      message.error('You can only upload a mapping file! Found: ' + file.type);
      this.setState({ loading: false });
    }

    else {
      getBase64(file, (file64) => {
        let json = {
          content: file64,
          fileType: ".xml",
          fileName: file.name
        }

        uploadMappingFile(this.props.current.name, this.props.current.version, json, (success) => {
          if (success) {
            message.success('upload successfully.');
            this.props.rerender(success)
          }
          this.setState({ loading: false });
        })
      })
    }
  }

  else if (this.props.type === 'kg') {
    const validFormat = true;
    if (!validFormat) {
      message.error('You can only upload a RDF file! Found: ' + file.type);
      this.setState({ loading: false });
    }

    else {
      getBase64(file, (file64) => {
        const fileInfo = {
          content: file64,
          fileType: "N3",
          fileName: file.name
        }

        postKnowledgeGraphFile(this.props.current.kgIri, fileInfo, (success) => {
          if (success) {
            message.success('upload successfully.');
            this.props.rerender(success)
          }
          this.setState({ loading: false });
        })
      })
    }
  }

  return false;
}

export default class UploadFile extends React.Component {
  state = {
    loading: false,
  };

  render() {
    const title = this.props.type === 'mapping' ?
      <div>
        <p>Click or Drag Mapping here</p>
        <p>or</p>
        <p>Create a new Mapping through form below</p>
      </div> :
      this.props.type === 'kg' ?
        'Upload RDF file' :
        'Upload Ontology Version'
    let h = 199
    return (
      <div style={{ height: h, width: '100%' }}>
        <Upload className='bigUpload' beforeUpload={beforeUpload.bind(this)} fileList={[]}>
          <Button style={{ height: h, width: '100%' }} type='primary' loading={this.state.loading}>
            <Icon type={this.state.loading ? "loading" : "plus"} /> {this.state.loading ? "Uploading" : title}
          </Button>
        </Upload>
      </div>

    );
  }
}
