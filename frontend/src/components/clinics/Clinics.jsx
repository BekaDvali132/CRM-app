import { Button, Space, Table } from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Clinics.css'
const columns = [
  {
    title: "კლინიკის დასახელება",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "საიდენტიფიკაციო/კოდი ",
    dataIndex: "identity_code",
    key: "identity_code",
  },
  {
    title: "ტელეფონის ნომერი",
    dataIndex: "phone_number",
    key: "phone_number",
  },
  {
    title: "საკონტაქტო პირი",
    dataIndex: "contact_person",
    key: "contact_person",
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

const Clinics = () => {
  const [clinics, setClincs] = useState([]);
  const navigate = useNavigate()

  const getClinics = () => {
    axios.get("api/clinics").then((res) => {
      if (res.data.status === "success") {
        setClincs(res.data.data);
      }
    });
  };
  useEffect(() => {
    getClinics();
  }, []);
  return (
    <Space direction="vertical" size={"large"} className="clinic-table">
      <Button type="primary mb-3" onClick={()=>navigate('/clinics/register')}>კლინიკის რეგისტრაცია</Button>

      <Table
        columns={columns}
        dataSource={clinics?.map((clinic) => {
          return ({
            key: clinic._id,
            name: clinic.text,
            age: 32,
            address: "10 Downing Street",
          });
        })}
      />
    </Space>
  );
};

export default Clinics;
