import { Button, Form, Input } from "antd";
import { useState } from "react";

const RegisterClinic = () => {

    const [errors,setErrors] = useState()

    const onFinish = (values) => {

    }
  return (
    <>
      <Form layout={"vertical"} onFinish={onFinish}>
        <Form.Item
          label="დასახელება"
          name="name"
          validateStatus={errors?.name ? `error` : ""}
          rules={[
            {
              required: false,
            },
          ]}
          help={errors?.name}
        >
          <Input
            placeholder="შეიყვანეთ დასახელება"
            id={errors?.name ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="პაროლი"
          name="password"
          rules={[
            {
              required: false,
            },
          ]}
          validateStatus={errors?.password ? `error` : ""}
          help={errors?.password}
        >
          <Input.Password
            placeholder="შეიყვანეთ პაროლი"
            id={errors?.password ? `error` : ""}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterClinic;
