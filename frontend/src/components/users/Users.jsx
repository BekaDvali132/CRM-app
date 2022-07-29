import { Button, Modal, Space, Table } from "antd";
import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../hooks/contexts/UserContext";

const columns = [
    {
      title: "დასახელება ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "მეილი",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "როლი",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "რედაქტირება",
      dataIndex: "edit",
      key: "edit",
    },
    {
      title: "წაშლა",
      dataIndex: "delete",
      key: "delete",
    },
  ];

const roles = [
    'ადმინისტრატორი',
    'მენეჯერი'
]

const Users = () => {

    const [show, setShow] = useState()
    const [deletableUser, setDeletableUser] = useState()
    const [users, setUsers] = useState([])
    const userInfo = useContext(UserContext)

    const navigate = useNavigate()

    useEffect(()=>{
        axios.get('/api/users').then(res=> {
            if (res.data?.status==='success') {
                setUsers(res.data.data)
            } else{

            }
        })
    },[])

    const deleteClinic = () => {

    }

    const handleCancel = () => {

    }

  return (
    <>
      <Space direction="vertical" size={"large"} className="clinic-table">
        <Button
          type="primary mb-3"
          onClick={() => navigate("/users/register")}
        >
          მომხმარებლის რეგისტრაცია
        </Button>

        <Table
          columns={columns}
          pagination={{
            position: ["topLeft", "bottomRight"],
            pageSize: "5",
          }}
          dataSource={users?.filter(user=>user._id!==userInfo?.id)?.map((user) => {
            return {
              key: user._id,
              name: user.name,
              email: user.email,
              role: roles[user.role-1],
              edit: (
                <Button
                  type="secondary"
                  onClick={() => navigate(`/clinics/edit/${user._id}`)}
                >
                  რედაქტირება
                </Button>
              ),
              delete: (
                <Button
                  type="danger"
                  onClick={() => {
                    setShow(true);
                    setDeletableUser(user);
                  }}
                >
                  წაშლა
                </Button>
              ),
            };
          })}
        />
      </Space>
      <Modal visible={show} onOk={deleteClinic} onCancel={handleCancel}>
        ნამდვილად გსურთ {deletableUser?.name} წაშლა?
      </Modal>
    </>
  );
};

export default Users;
