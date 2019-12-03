import React from 'react'
import uc from '../../underConstruction.gif'

export default class UnderConstruction extends React.Component {
    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'}}>
                <h1>We are working on it...</h1>
                <img src={uc} alt='' style={{margin: 'auto', width: 200, height: 'auto'}}/>
            </div>
        )
    }
}