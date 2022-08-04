import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MedicineBoxOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Affix, Avatar, Layout, Menu, Tooltip } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../hooks/contexts/UserContext";
import "./UserRoute.css";
const { Header, Sider, Content } = Layout;

const UserRoute = ({setUser}) => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const location = useLocation()

  axios.interceptors.request.use(function (config) {
    const bearer = user?.token || localStorage.getItem('token') || '';

    config.headers.authorization = "Bearer " + bearer;
    return config;
  });

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.status === 401) {
        setUser(null)
        localStorage.removeItem('token')
        navigate("/login");
      }
    }
  );

  const logOut = async () => {
    localStorage.removeItem('token')
    await setUser(null);
    navigate('/login')
  }

  useEffect(() => {
    axios
      .get(`/api/user/me`, {
        headers: {
          authorization:
            "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(async (res) => {
        if (res?.data?.status === "success") {
          await setUser(res.data.data)
        }
      });
  }, []);

  return (
    <Layout>
      <Affix style={{minHeight:'100vh'}}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{minHeight:'100vh'}}>
        <div className="logo" onClick={()=>navigate('/profile')}>
        <Tooltip placement="right" title={user?.name + ' ' + user?.surname} color={'#108ee9'}>
          <Avatar size={40} icon={<UserOutlined/>} style={{cursor:'pointer'}}/>
        </Tooltip>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: "1",
              icon: <MedicineBoxOutlined />,
              label: "კლინიკები",
              onClick: ()=>navigate('/clinics'),
            },
            {
              key: "2",
              icon: <InfoCircleOutlined />,
              label: "შეთავაზებები",
              onClick: ()=>navigate('/')
            },
            user?.role === 1 && {
              key: "3",
              icon: <UserOutlined />,
              label: "მომხმარებლები",
              onClick: ()=>navigate('/users')
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              style: {position:"absolute",bottom:'50px',width:'100%'},
              label: "გასვლა",
              onClick: ()=>logOut()
            }
          ]}
        />
      </Sider>
      </Affix>
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
