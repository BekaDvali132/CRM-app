import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd";
import { useContext, useState } from "react";
import axios from "axios";
import moment from "moment";
import {ArrowLeftOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const UsersRegister = () => {
  const [errors, setErrors] = useState();
  const navigate = useNavigate();

  const onFinish = (values) => {

    axios.post("/api/users", values).then((res) => {
      if (res.data.status === "success") {
        navigate('/users')
        setErrors(null);
      } else {
        setErrors(res.data.errors);
        if (res.data?.message) {
          Modal.error({
            title: res.data.message
          })
        }
      }
    });
  };

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <ArrowLeftOutlined
        style={{ fontSize: "20px" }}
        onClick={() => navigate("/users")}
      />
      <Form
        layout={"vertical"}
        onFinish={onFinish}
        style={{ maxWidth: "750px", margin: "auto" }}
      >
        <Form.Item
          label="*მომხმარებლის სახელი"
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
            placeholder="შეიყვანეთ მომხმარებლის სახელი"
            id={errors?.name ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="*მომხმარებლის გვარი"
          name="surname"
          validateStatus={errors?.surname ? `error` : ""}
          rules={[
            {
              required: false,
            },
          ]}
          help={errors?.surname}
        >
          <Input
            placeholder="შეიყვანეთ მომხმარებლის გვარი"
            id={errors?.surname ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="*მომხმარებლის ელ.ფოსტა"
          name="email"
          validateStatus={errors?.email ? `error` : ""}
          rules={[
            {
              required: false,
            },
          ]}
          help={errors?.email}
        >
          <Input
            placeholder="შეიყვანეთ მომხმარებლის ელ.ფოსტა"
            id={errors?.email ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          name="role"
          label="*მომხმარებლის როლი"
          validateStatus={errors?.role ? `error` : ""}
          help={errors?.role}
        >
          <Select
            placeholder="აირჩიე მომხმარებლის როლი"
            allowClear
            id={errors?.role ? `error` : ""}
          >
            <Select.Option value="1">ადმინისტრატორი</Select.Option>
            <Select.Option value="2">მენეჯერი</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
          შენახვა
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default UsersRegister;
