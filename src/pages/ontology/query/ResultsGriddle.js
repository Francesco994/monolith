import React from 'react'

const Griddle = require('griddle-react');
const https = require('https');

const fakeDataUrl = "https://swapi.co/api/people/"

export default class Results extends React.Component {
    state = {
        "results": [],
        "currentPage": 0,
        "maxPages": 0,
        "externalResultsPerPage": 5,
        "externalSortColumn": null,
        "externalSortAscending": true
    }

    getExternalData = (page) => {
        page = page||1

        https.get(fakeDataUrl, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
      
        // swapiModule.getStarships(page, function(data) {
        //  that.setState({
        //     results: data.results,
        //     currentPage: page-1,
        //     maxPages: Math.round(data.count/10)
        //   })
        // });
      }

    componentDidMount(){
        this.getExternalData();
    }

    setPage = (index) => {
        //This should interact with the data source to get the page at the given index
        index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
        this.getExternalData(index);
      }

    render() {
        return <Griddle useExternal={true} 
            externalSetPage={this.setPage}
            externalMaxPage={this.state.maxPages}
            externalCurrentPage={this.state.currentPage} 
            results={this.state.results}
            resultsPerPage={this.state.externalResultsPerPage}
            externalSortColumn={this.state.externalSortColumn}
            externalSortAscending={this.state.externalSortAscending}
            showFilter={true} showSettings={true} />
    }
}
