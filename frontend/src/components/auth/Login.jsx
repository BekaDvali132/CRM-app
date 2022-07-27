import { Button, Form, Input } from "antd";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
const Login = () => {
  const [errors, setErrors] = useState();
  const navigate = useNavigate();

  const onFinish = (values) => {
    axios.post("api/users/login", values).then((res) => {
      if (res.data?.status === "success") {
        setErrors(null);
        localStorage.setItem("user", JSON.stringify(res?.data?.data));
        navigate("/");
      } else {
        setErrors(res.data?.errors);
      }
    });
  };

  const getMe = () => {
    axios
      .get("api/users/me", {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user"))?.token,
        },
      })
      .then((res) => {
        if (res?.data?.status === "success") {
          localStorage.setItem("user", JSON.stringify(res?.data?.data));
          navigate("/");
        }
      });
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      getMe();
    }
  }, []);

  return (
    <div className="login">
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
    </div>
  );
};

export default Login;
