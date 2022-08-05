import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import moment from "moment";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { UserContext } from "../hooks/contexts/UserContext";

const Profile = () => {
    const [errors, setErrors] = useState();
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [form] = Form.useForm()

    const onFinish = (values) => {
        values.id = user?.id
        axios.put(`/api/user/me`, values).then((res) => {
          if (res.data.status === "success") {
            setErrors(null);
            navigate('/')
          } else {
            setErrors(res.data.errors);
          }
        });
      };

      useEffect(() => form.setFieldsValue(user), [user]);

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Form
        layout={"vertical"}
        onFinish={onFinish}
        style={{ maxWidth: "750px", margin: "auto" }}
        form={form}
      >
        <Form.Item
          label="*მომხმარებლის დასახელება"
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
            placeholder="შეიყვანეთ მომხმარებლის დასახელება"
            id={errors?.name ? `error` : ""}
            disabled
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
            disabled
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
            disabled
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
            disabled
          >
            <Select.Option value={1}>ადმინისტრატორი</Select.Option>
            <Select.Option value={2}>მენეჯერი</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="*მომხმარებლის ახალი პაროლი"
          name="password"
          validateStatus={errors?.password ? `error` : ""}
          rules={[
            {
              required: false,
            },
          ]}
          help={errors?.password}
        >
          <Input.Password
            placeholder="შეიყვანეთ მომხმარებლის ახალი პაროლი"
            id={errors?.password ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="*გაიმეორეთ მომხმარებლის ახალი პაროლი"
          name="repeat_password"
          validateStatus={errors?.repeat_password ? `error` : ""}
          rules={[
            {
              required: false,
            },
          ]}
          help={errors?.repeat_password}
        >
          <Input.Password
            placeholder="გაიმეორეთ მომხმარებლის ახალი პაროლი"
            id={errors?.repeat_password ? `error` : ""}
          />
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

export default Profile;