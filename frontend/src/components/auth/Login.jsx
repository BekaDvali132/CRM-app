import { Button, Form, Input } from "antd";
import "./Login.css";

const Login = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login">
      <Form 
      layout={"vertical"}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      >
        <Form.Item 
        label="დასახელება"
        name="username"
        rules={[
          {
            required: true,
            message: 'შეიყვანეთ დასახელება',
          },
        ]}>
          <Input placeholder="შეიყვანეთ დასახელება" />
        </Form.Item>
        <Form.Item 
        label="პაროლი"
        name="password"
        rules={[
          {
            required: true,
            message: 'შეიყვანეთ პაროლი',
          },
        ]}>
          <Input placeholder="შეიყვანეთ პაროლი" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
