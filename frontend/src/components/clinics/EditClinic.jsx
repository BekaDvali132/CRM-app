import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import moment from "moment";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { UserContext } from "../hooks/contexts/UserContext";

const EditClinic = () => {
  const [errors, setErrors] = useState();
  const [fields, setFields] = useState([]);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm()


  useEffect(() => {
    axios.get(`/api/clinics/${id}`).then(
        res => {
            if (res.data.status === 'success') {
              res.data.data.contract_date = moment(res.data.data.contract_date)
              res.data.data.register_date = moment(res.data.data.register_date)

              form.setFieldsValue(res.data.data)
              // Object.keys(res.data.data).forEach(key => {
              //   setFields(current => [...current,{
              //       name: [
              //         key
              //       ],
              //       value: res.data.data?.[key]
              //     }])
              //   });
              setFields(res.data.data)
            }
        }
    );
  }, []);

  const onFinish = (values) => {
    values.manager = user.id;
    values.id = id;
    axios.put(`/api/clinics/${id}`, values).then((res) => {
      if (res.data.status === "success") {
        setErrors(null);
      } else {
        setErrors(res.data.errors);
      }
    });
  };

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <ArrowLeftOutlined
        style={{ fontSize: "20px" }}
        onClick={() => navigate("/clinics")}
      />
      <Form
        layout={"vertical"}
        onFinish={onFinish}
        style={{ maxWidth: "750px", margin: "auto" }}
        form={form}
      >
        <Form.Item
          label="საიდენტიფიკაციო კოდი"
          name="identity_code"
          validateStatus={errors?.identity_code ? `error` : ""}
          help={errors?.identity_code}

        >
          <Input
            placeholder="შეიყვანეთ საიდენტიფიკაციო კოდი"
            id={errors?.identity_code ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="*ტელეფონის ნომერი"
          name="phone_number"
          validateStatus={errors?.phone_number ? `error` : ""}
          rules={[
            {
              required: false,
            },
          ]}
          help={errors?.phone_number}
        >
          <Input
            placeholder="შეიყვანეთ ტელეფონის ნომერი"
            id={errors?.phone_number ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="*კლინიკის დასახელება"
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
            placeholder="შეიყვანეთ კლინიკის დასახელება"
            id={errors?.name ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="საკონტაქტო პირის ტელეფონის ნომერი"
          name={["contact_person", "phone_number"]}
          validateStatus={errors?.contact_person?.phone_number ? `error` : ""}
          rules={[
            {
              required: false,
            },
          ]}
          help={errors?.contact_person?.phone_number}
        >
          <Input
            placeholder="შეიყვანეთ საკონტაქტო პირის ტელეფონის ნომერი"
            id={errors?.contact_person?.phone_number ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="საკონტაქტო პირის ელ.ფოსტა"
          name={["contact_person", "email"]}
          validateStatus={errors?.contact_person?.email ? `error` : ""}
          help={errors?.contact_person?.email}
        >
          <Input
            placeholder="შეიყვანეთ საკონტაქტო პირის ელ.ფოსტა"
            id={errors?.contact_person?.email ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="საკონტაქტო პირის პოზიცია"
          name={["contact_person", "position"]}
          validateStatus={errors?.contact_person?.position ? `error` : ""}
          help={errors?.contact_person?.position}
        >
          <Input
            placeholder="შეიყვანეთ საკონტაქტო პირის პოზიცია"
            id={errors?.contact_person?.position ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="*სტატუსი"
          validateStatus={errors?.status ? `error` : ""}
          help={errors?.status}
        >
          <Select
            placeholder="აირჩიე კლინიკის სტატუსი"
            allowClear
            id={errors?.status ? `error` : ""}
          >
            <Select.Option value="1">მუშავდება</Select.Option>
            <Select.Option value="2">პოტენციური</Select.Option>
            <Select.Option value="3">წაგებული</Select.Option>
            <Select.Option value="4">დაკონტრაქტებული</Select.Option>
            <Select.Option value="5">არ არის დაინტერესებული</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="register_date"
          label="*რეგისტრაციის თარიღი"
          initialValue={moment()}
        >
          <DatePicker format={"DD/MM/YYYY"} disabled />
        </Form.Item>
        <Form.Item
          name="contract_date"
          label="*შემდეგი კონტაქტის თარიღი"
          initialValue={moment()}
          validateStatus={errors?.contract_date ? `error` : ""}
          help={errors?.contract_date}
        >
          <DatePicker
            format={"DD/MM/YYYY"}
            id={errors?.contract_date ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="*მენეჯერი"
          name="manager"
          validateStatus={errors?.manager ? `error` : ""}
          help={errors?.manager}
          initialValue={user.name}
        >
          <Input
            placeholder="შეიყვანეთ მენეჯერი"
            id={errors?.manager ? `error` : ""}
            disabled
          />
        </Form.Item>
        <Form.Item
          label="კომენტარი"
          name="comment"
          validateStatus={errors?.comment ? `error` : ""}
          help={errors?.comment}
        >
          <Input.TextArea
            rows={4}
            placeholder="შეიყვანეთ კომენტარი"
            id={errors?.comment ? `error` : ""}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default EditClinic;
