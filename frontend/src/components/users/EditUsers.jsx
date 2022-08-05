import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, Space } from "antd";
import moment from "moment";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { UserContext } from "../hooks/contexts/UserContext";


const EditUsers = () => {
    const [errors, setErrors] = useState();
  const [fields, setFields] = useState([]);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm()


  useEffect(() => {
    axios.get(`/api/users/${id}`).then(
        res => {
            if (res.data.status === 'success') {
              form.setFieldsValue(res.data.data)
              setFields(res.data.data)
            }
        }
    );
  }, []);

  const onFinish = (values) => {
    values.manager = user.id;
    values.id = id;
    axios.put(`/api/users/${id}`, values).then((res) => {
      if (res.data.status === "success") {
        setErrors(null);
        navigate('/users')
      } else {
        setErrors(res.data.errors);
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
        form={form}
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
            <Select.Option value={1}>ადმინისტრატორი</Select.Option>
            <Select.Option value={2}>მენეჯერი</Select.Option>
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
}
 
export default EditUsers;