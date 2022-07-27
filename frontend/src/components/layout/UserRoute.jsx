import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../hooks/contexts/UserContext";
import "./UserRoute.css";

const { Header, Sider, Content } = Layout;

const UserRoute = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  axios.interceptors.request.use(function (config) {
    const bearer = user?.token || "";

    config.headers.authorization = "Bearer " + bearer;
    return config;
  });

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.status === 401) {
        navigate("/login");
      }
    }
  );

  useEffect(() => {
      axios
        .get("api/users/me", {
          headers: { authorization: "Bearer " + JSON.parse(localStorage.getItem('user'))?.token },
        })
        .then((res) => {
          if (res?.data?.status === "success") {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...res?.data?.data, token: user.token })
            );
          }
        });

    // axios.interceptors.response.use(function (response) {
    //   return response;
    // }, function (error) {
    //   if (error?.response?.status === 401 || error.response.status === 419) {
    //     navigate('/login')
    //   } else return Promise.reject(error);
    // });
  }, []);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <h1>{user?.name}</h1>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined
              width={"25"}
              height={"25"}
              className="trigger"
              onClick={() => setCollapsed(!collapsed)}
            />
          ) : (
            <MenuFoldOutlined
              className="trigger"
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserRoute;
