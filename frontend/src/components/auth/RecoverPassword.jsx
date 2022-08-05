import { Button, Form, Input, message, Modal } from "antd";
import axios from "axios";
import "./Login.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../hooks/contexts/UserContext";

const RecoverPassword = ({setUser}) => {
    const [errors, setErrors] = useState();
  const navigate = useNavigate();
const {id} = useParams()

  const onFinish = (values) => {
    values.code = id;

      axios.post('/api/users/submit-code', values).then(async (res) => {

        if (res.data.status==='success') {
          message.success('თქვენ წარმატებით აღადგინეთ პაროლი')
            navigate("/login");
        } else {
            setErrors(res.data?.errors);
        }
  
      })  
  };

  const getMe = () => {
    axios
      .get("api/users/me", {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
      })
      .then((res) => {
        if (res?.data?.status === "success") {
          localStorage.setItem("token", JSON.stringify(res?.data?.data?.token));
          navigate("/");
        }
      });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getMe();
    }
  }, []);


  return (
    <div className="login">
      <Form
        layout={"vertical"}
        onFinish={onFinish}
        className={`login-form ${errors && "error"}`}
      >
        <Form.Item
          label="ახალი პაროლი"
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
            placeholder="შეიყვანეთ ახალი პაროლი"
            id={errors?.password ? `error` : ""}
          />
        </Form.Item>
        <Form.Item
          label="გაიმეორეთ ახალი პაროლი"
          name="repeat_password"
          rules={[
            {
              required: false,
            },
          ]}
          validateStatus={errors?.repeat_password ? `error` : ""}
          help={errors?.repeat_password}
        >
          <Input.Password
            placeholder="ხელახლა შეიყვანეთ ახალი პაროლი"
            id={errors?.repeat_password ? `error` : ""}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            შესვლა
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RecoverPassword;
