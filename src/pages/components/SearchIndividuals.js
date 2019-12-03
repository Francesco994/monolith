import React from 'react';
import {Input } from 'antd';

const Search = Input.Search;

export default class SearchIndividuals extends React.Component {
  
  onSearch = (e) => {
    console.log(`Searched ${e}`)
  }

  render() {
    
    return (
      <div>
        <Search style={this.props.style} placeholder="Search for Individuals" onSearch={this.onSearch}/>
      </div>
    );
  }
}
