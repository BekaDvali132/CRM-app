import { Button, Form, Input, message, Modal } from "antd";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../hooks/contexts/UserContext";
const Login = ({ setUser }) => {
  const [errors, setErrors] = useState();
  const [show, setShow] = useState(false);
  const [codeStep, setCodeStep] = useState(false);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [form] = Form.useForm()
  const [email, setEmail] = useState();

  const onFinish = (values) => {
    axios.post("api/users/login", values).then(async (res) => {
      if (res.data?.status === "success") {
        setErrors(null);
        await setUser(res.data.data);
        localStorage.setItem("token", res?.data?.data?.token);
        navigate("/");
      } else {
        setErrors(res.data?.errors);
      }
    });
  };

  const restorePassword = (values) => {

    axios.post('/api/users/send-code', values).then((res) => {

      if (res.data.status==='success') {
        setShow(false)
        message.success(`პაროლის აღდგენა გამოიგზავნა ${values.email}-ზე`)
        setErrors(null)
        form.resetFields()
      } else {
        setErrors(res.data.errors)
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
      <Modal
        title={"პაროლის აღდგენა"}
        visible={show}
        okText={"გაგზავნა"}
        cancelText={"გაუქმება"}
        onCancel={() => {setShow(false);setCodeStep(false)}}
        onOk={form.submit}
      >
        <Form layout={"vertical"} form={form} onFinish={restorePassword} preserve>
          <Form.Item
            label={"ელ.ფოსტა"}
            name={"email"}
            validateStatus={errors?.['email'] ? `error` : ""}
            rules={[
              {
                required: false,
              },
            ]}
            help={errors?.['email']}
          >
            <Input
              placeholder={`შეიყვანეთ თქვენი ელ.ფოსტა`}
              id={errors?.['email'] && `error`}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Form layout={"vertical"} onFinish={onFinish} className={`login-form ${errors && 'error'}`}>
        <Form.Item
          label="ელ.ფოსტა"
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
            placeholder="შეიყვანეთ ელ.ფოსტა"
            id={errors?.email ? `error` : ""}
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
            შესვლა
          </Button>
          <Button type="link" onClick={()=>setShow(true)}>
            პაროლის აღდგენა
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
