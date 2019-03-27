import React from 'react'
import { Select, Divider } from 'antd';
import {renders} from '../utils/utils'

const Option = Select.Option;
export default class Settings extends React.Component {

    handleChange = (value) => {
        localStorage.setItem('renderEntity', value)
    }

    render() {
        return (
            <div>
                <Divider>Render entities as</Divider>
                <Select defaultValue={localStorage.getItem('renderEntity') || renders[0]} style={{ width: 250 }} onChange={this.handleChange}>
                    {renders.map(r => <Option value={r} key={r}>{r}</Option>)}
                </Select>
            </div>
        )
    }
}