import React from 'react'
import { Spin } from 'antd'
import OntologiesList from './OntologiesList'
import OntologyVersionsList from './OntologyVersionsList'
import { getOntologies } from '../../api/MastroApi'

export default class LoadOntologies extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            ontologyID: null,
            data: [],
            loading: true
        };

        this.prev = this.prev.bind(this)
    }

    componentDidMount() {
        this._isMounted = true;
        this.requestOntologies()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    requestOntologies() {
        this._isMounted && this.setState({ loading: true })
        getOntologies(this.loaded)
    }

    loaded = (data) => {
        if (data === undefined)
            data = []
        this._isMounted && this.setState((state) => ({
            current: state.current,
            ontologyID: state.ontologyID,
            data: data,
            loading: false
        }));
    }

    next(ontologyID) {
        const current = this.state.current + 1;
        this._isMounted && this.setState((state) => ({
            current: current,
            ontologyID: ontologyID,
            data: state.data
        }
        ))
    }

    prev() {
        const current = this.state.current - 1;
        this._isMounted && this.setState((state) => ({
            current: current,
            ontologyID: state.ontologyID,
            data: state.data
        }
        ))
    }

    render() {
        return (
            this.state.loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36 }}> <Spin size='large' /></div> :
                <div>
                    {
                        this.state.current === 0 ?
                            <OntologiesList
                                data={this.state.data}
                                next={this.next.bind(this)}
                                rerender={this.requestOntologies.bind(this)}
                                close={this.props.close}
                            /> :
                            <OntologyVersionsList
                                data={this.state.data}
                                current={this.state.ontologyID}
                                prev={this.prev.bind(this)}
                                rerender={this.requestOntologies.bind(this)}
                                open={this.props.open}
                                close={this.props.close}
                            />
                    }

                </div>);
    }
}
