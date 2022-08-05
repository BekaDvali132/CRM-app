import {
  Button,
  Checkbox,
  DatePicker,
  message,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Form,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../hooks/contexts/UserContext";
import "./Clinics.css";

const status = [
  "მუშავდება",
  "პოტენციური",
  "წაგებული",
  "დაკონტრაქტებული",
  "არ არის დაინტერესებული",
];

const Clinics = () => {
  const [clinics, setClincs] = useState([]);
  const [allClinics, setAllClincs] = useState([]);
  const navigate = useNavigate();
  const [render, setRender] = useState(true);
  const [show, setShow] = useState(false);
  const [deletableClinic, setDeletableClinic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const user = useContext(UserContext)

  const getClinics = (params) => {
    setLoading(true);
    axios.get(`api/clinics`, { params: params }).then((res) => {
      if (res.data.status === "success") {
        setLoading(false);
        setClincs(res.data.data);
        !params && setAllClincs(res.data.data)
      }
    });
  };

  const getUsers = () => {
    axios.get("api/users").then((res) => {
      if (res.data.status === "success") {
        setUsers(res.data.data);
      }
    });
  };

  useEffect(() => {
    getClinics();
    getUsers();
  }, [render]);

  const deleteClinic = () => {
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

  const generateExcel = (clinic) => {
    axios.post("api/clinics/generate", clinic, {
      responseType: 'blob'
     }).then((response) => {
      let headerLine = response.headers['content-disposition'];
   let startFileNameIndex = headerLine.indexOf('"') + 1
   let endFileNameIndex = headerLine.lastIndexOf('"')
   let filename = headerLine.substring(startFileNameIndex, endFileNameIndex)
   const url = window.URL.createObjectURL(new Blob([response.data], 
   {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
   const link = document.createElement('a');

   link.href = url;
   link.setAttribute('download', filename);
   document.body.appendChild(link);
   link.click();
   link.remove();
    });
  };

  const getClinic = (id) => {
    axios.get(`/api/clinics/${id}`).then((res) => {
      if (res.data.status === "success") {
        setClincs([res.data.data]);
      }
    });
  };

  const changeDate = (value) => {
    if (value?.[0] && value?.[1]) {
      getClinics({
        start_date: value[0].startOf("day").toDate(),
        end_date: value[1].endOf("day").toDate(),
      });
    } else {
      getClinics();
    }
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    if (sorter?.field, sorter?.order) {
      getClinics({ field: sorter?.field, order: sorter?.order });
    }
  };

  const columns = [
    {
      title: "საიდენტიფიკაციო/კოდი ",
      dataIndex: "identity_code",
      key: "identity_code",
      sorter: true
    },
    {
      title: "ტელეფონის ნომერი",
      dataIndex: "phone_number",
      key: "phone_number",
      sorter: true
    },
    {
      title: "კლინიკის დასახელება",
      dataIndex: "name",
      key: "name",
      sorter: true
    },
    {
      title: "საკონტაქტო პირის ტელეფონის ნომერი",
      dataIndex: "contact_person_phone",
      key: "contact_person_phone"
    },
    {
      title: "საკონტაქტო პირის ელ.ფოსტა",
      dataIndex: "contact_person_email",
      key: "contact_person_email"
    },
    {
      title: "საკონტაქტო პირის პოზიცია",
      dataIndex: "contact_person_position",
      key: "contact_person_position"
    },
    {
      title: "რეგისტრაციის თარიღი",
      dataIndex: "register_date",
      key: "register_date",
      sorter: true
    },
    {
      title: "შემდეგი კონტაქტის თარიღი",
      dataIndex: "contract_date",
      key: "contract_date",
      sorter: true
    },
    {
      title: "სტატუს",
      dataIndex: "status",
      key: "status",
      sorter: true
    },
    {
      title: "მენეჯერი",
      dataIndex: "manager",
      key: "manager",
      sorter: true
    },
    {
      title: "რეპორტის გენერაცია",
      dataIndex: "generate_excel",
      key: "generate_excel",
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

  const checkPermission = (clinic) => {

    if (user?.role !== 1) {

      if (user?.id !== clinic?.manager) {
         return true;
      } else {
        return false;
      }
      
    } else {

      return false;

    }

  }

  return (
    <>
      <Space direction="vertical" size={"large"} className="clinic-table">
        <Form form={form}>
          <Space direction="vertical" size={"large"} className="clinic-table">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="primary mb-3"
                onClick={() => navigate("/clinics/register")}
              >
                კლინიკის რეგისტრაცია
              </Button>
              <Form.Item name={"range"}>
                <RangePicker
                  format={"DD/MM/YYYY"}
                  onChange={(value) => {
                    changeDate(value);
                    form.resetFields(['manager','clinic','status','expired'])
                  }}
                  allowClear
                />
              </Form.Item>
              <Button
                type="primary mb-3"
                onClick={() => generateExcel(clinics)}
                disabled={checkPermission()}
              >
                რეპორტის გენერაცია
              </Button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item name={"manager"}>
                <Select
                  placeholder="აირჩიე მენეჯერი"
                  allowClear
                  onSelect={(value) => {getClinics({ manager: value });form.resetFields(['range','clinic','status','expired'])}}
                  onClear={() => getClinics()}
                >
                  {users?.map((user) => (
                    <Select.Option value={user?._id} key={user?._id}>
                      {user?.name + ' ' + user?.surname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="clinic">
                <Select
                  placeholder="აირჩიე კლინიკა"
                  allowClear
                  onSelect={(value) => {getClinic(value);form.resetFields(['manager','range','status','expired'])}}
                  onClear={() => getClinics()}
                >
                  {allClinics?.map((clinic) => (
                    <Select.Option value={clinic._id} key={clinic._id}>
                      {clinic.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="status">
                <Select
                  placeholder="აირჩიე სტატუსი"
                  allowClear
                  onSelect={(value) => {
                    getClinics({ status: value });
                    form.resetFields(['manager','clinic','range','expired'])
                  }}
                  onClear={() => getClinics()}
                >
                  {status?.map((stat) => (
                    <Select.Option
                      value={status.indexOf(stat) + 1}
                      key={status.indexOf(stat) + 1}
                    >
                      {stat}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="expired">
                <Checkbox
                  onChange={(e) =>{
                    getClinics(
                      e.target.checked
                        ? {
                            expired: true,
                            start_date: moment(new Date(2001, 1, 1)).toDate(),
                            end_date: moment().startOf("day").toDate(),
                          }
                        : ""
                    )
                    form.resetFields(['manager','clinic','status','status'])
                  }}
                >
                  ვადაგადაცილებულები
                </Checkbox>
              </Form.Item>
            </div>
          </Space>
        </Form>
        <Table
          columns={columns}
          pagination={{
            position: ["topLeft", "bottomRight"],
            pageSize: "5",
          }}
          loading={loading}
          onChange={handleTableChange}
          dataSource={clinics?.map((clinic) => {
            return {
              key: clinic._id,
              name: <div>{clinic.name}</div>,
              identity_code: clinic.identity_code,
              phone_number: clinic.phone_number,
              contact_person_email: clinic.contact_person.email,
              contact_person_position: clinic.contact_person.position,
              status: status[clinic.status - 1],
              register_date: moment(clinic.register_date).format("DD/MM/YYYY"),
              contract_date: moment(clinic.contract_date).format("DD/MM/YYYY"),
              manager: clinic.manager_name,
              contact_person_phone: clinic.contact_person.phone_number,
              generate_excel: (
                <Button type="success" disabled={checkPermission(clinic)} onClick={() => generateExcel([clinic])}>
                  რეპორტის გენერაცია
                </Button>
              ),
              edit: (
                <Button
                  type="secondary"
                  disabled={checkPermission(clinic)} 
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
                  disabled={checkPermission(clinic)} 
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
