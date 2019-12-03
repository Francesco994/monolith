import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { login } from '../../api/MastroApi'

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  state = {
    loading: false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.setState({ loading: true })
        login(values.userName, values.password, values.mastroUrl, this.callback);
      }
    });
  }

  callback = (success) => {
    if (success) {
      this.props.login(success)
    }
    else {
      this.setState({ loading: false })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your Username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('mastroUrl', {
            initialValue: localStorage.getItem('mastroUrl'),
            rules: [{ required: true, message: 'Please input Mastro Location!' }],
          })(
            <Input prefix={<Icon type="medium" style={{ color: 'rgba(0,0,0,.25)' }} />} type="medium" placeholder="Mastro URL" />
          )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          {/* {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )} */}
          {/* <a className="login-form-forgot" href="mailto:santarelli@diag.uniroma1.it?subject=Forgot%20Password%20Monolith" style={{ color: 'white' }}>Forgot password</a> */}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" loading={this.state.loading}>
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const LoginForm = Form.create()(NormalLoginForm);

export default LoginForm;