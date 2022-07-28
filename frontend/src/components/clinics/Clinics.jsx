import { Button, message, Modal, notification, Space, Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Clinics.css";
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
    title: "სტატუსი",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "რეგისტრაციის თარიღი",
    dataIndex: "register_date",
    key: "register_date",
  },
  {
    title: "შემდეგი კონტაქტის თარიღი",
    dataIndex: "contract_date",
    key: "contract_date",
  },
  {
    title: "მენეჯერი",
    dataIndex: "status",
    key: "status",
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
  const navigate = useNavigate();
  const [render, setRender] = useState(true);
  const [show, setShow] = useState(false);
  const [deletableClinic, setDeletableClinic] = useState(null);

  const getClinics = () => {
    axios.get("api/clinics").then((res) => {
      if (res.data.status === "success") {
        setClincs(res.data.data);
      }
    });
  };

  useEffect(() => {
    getClinics();
  }, [render]);

  const deleteClinic = (id) => {
    setDeletableClinic(null);
    setShow(false);

    notification.destroy();
    message.loading({
      key: "updatable",
      content: "მიმდინარეობს კლინიკის წაშლა",
    });

    axios.delete(`/api/clinics/${deletableClinic?._id}`).then((res) => {
      if (res.data?.status === "success") {
        message.destroy();
        notification["success"]({
          key: "updatable",
          message: "კლინიკა წარმატებით წაიშალა",
        });
        setRender(!render);
      } else {
        notification["error"]({
          key: "updatable",
          message: "კლინიკა ვერ წაიშალა",
        });
      }
    });
  };

  const handleCancel = () => {
    setShow(false);
    setDeletableClinic(null);
  };

  return (
    <>
      <Space direction="vertical" size={"large"} className="clinic-table">
        <Button
          type="primary mb-3"
          onClick={() => navigate("/clinics/register")}
        >
          კლინიკის რეგისტრაცია
        </Button>

        <Table
          columns={columns}
          dataSource={clinics?.map((clinic) => {
            return {
              key: clinic._id,
              name: clinic.name,
              identity_code: clinic.identity_code,
              phone_number: clinic.phone_number,
              status: clinic.status,
              register_date: moment(clinic.register_date).format("DD/MM/YYYY"),
              contract_date: moment(clinic.contract_date).format("DD/MM/YYYY"),
              manager: clinic.manager,
              edit: (
                <Button
                  type="secondary"
                  onClick={() => navigate(`/clinics/edit/${clinic._id}`)}
                >
                  რედაქტირება
                </Button>
              ),
              delete: (
                <Button
                  type="danger"
                  onClick={() => {
                    setShow(true);
                    setDeletableClinic(clinic);
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
        ნამდვილად გსურთ {deletableClinic?.name} წაშლა?
      </Modal>
    </>
  );
};

export default Clinics;
