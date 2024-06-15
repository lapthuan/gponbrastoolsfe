import { Button, Popconfirm, Space, message } from "antd";
import { useEffect, useState, useCallback } from "react";
import useAsync from "../../hook/useAsync";
import { useForm } from "antd/es/form/Form";
import { QuestionCircleOutlined } from "@ant-design/icons";
import ServiceIp from "../../service/ServiceIp";
import debounce from "lodash/debounce";

const SubmitIP = () => {
  const [dataTable, setData] = useState([]);
  const [editTab, setEditTab] = useState(false);
  const [idEdit, setIdEdit] = useState();
  const [loading, setLoading] = useState(false);

  const { data } = useAsync(() => ServiceIp.getAllIp());
  const [form] = useForm();

  useEffect(() => {
    if (data) {
      const datatab = data.map((item, i) => ({
        _id: item._id,
        ipaddress: item.ipaddress,
        key: item._id,
      }));
      setData(datatab);
    }
  }, [data]);

  const handleSearch = useCallback(
    debounce(async (value) => {
      setLoading(true);
      if (value) {
        const res = await ServiceIp.searchIp(value);
        if (res) {
          const datatab = res.map((item, i) => ({
            _id: item._id,
            ipaddress: item.ipaddress,
            key: item._id,
          }));
          setData(datatab);
        } else {
          message.error("Không tìm thấy dữ liệu");
        }
      } else {
        // If the search input is empty, fetch all IP addresses
        const res = await ServiceIp.getAllIp();
        if (res) {
          const datatab = res.map((item, i) => ({
            _id: item._id,
            ipaddress: item.ipaddress,
            key: item._id,
          }));
          setData(datatab);
        } else {
          message.error("Không tìm thấy dữ liệu");
        }
      }
      setLoading(false);
    }, 300),
    []
  );

  const ChangeEdit = async (_id, ipaddress) => {
    await setIdEdit(_id);
    form.setFieldsValue({ ipaddress });
    setEditTab(true);
  };

  const handleEdit = async () => {
    const ipaddress = form.getFieldValue("ipaddress");
    if (ipaddress) {
      const res = await ServiceIp.editIp({ ipaddress }, idEdit);
      if (res.detail.msg === "success") {
        message.success("Sửa thành công");
        const datatab = res.detail.data.map((item, i) => ({
          _id: item._id,
          ipaddress: item.ipaddress,
          key: item._id,
        }));
        setData(datatab);
      } else {
        message.error("Địa chỉ ip không hợp lệ");
      }
    } else {
      message.error("Dữ liệu bỏ trống");
    }
  };

  const handleDelete = async (_id) => {
    const res = await ServiceIp.deleteIp(_id);
    if (res.detail.msg === "success") {
      message.success("Xóa thành công");
      const datatab = res.detail.data.map((item, i) => ({
        _id: item._id,
        ipaddress: item.ipaddress,
        key: item._id,
      }));
      setData(datatab);
    } else {
      message.error("Lỗi");
    }
  };

  const handleSubmit = async () => {
    const ipaddress = form.getFieldValue("ipaddress");
    if (ipaddress) {
      const res = await ServiceIp.createIp({ ipaddress });
      if (res.detail.msg === "success") {
        message.success("Thêm thành công");
        const datatab = res.detail.data.map((item, i) => ({
          _id: item._id,
          ipaddress: item.ipaddress,
          key: item._id,
        }));
        setData(datatab);
      } else {
        message.error("Địa chỉ ip không hợp lệ");
      }
    } else {
      message.error("Dữ liệu bỏ trống");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (id) => <p>{id.slice(-6)}</p>,
    },
    {
      title: "Ip",
      dataIndex: "ipaddress",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Công cụ",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => ChangeEdit(record._id, record.ipaddress)}
            style={{ backgroundColor: "green", borderColor: "green" }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc chắn xóa?"
            onConfirm={() => handleDelete(record._id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return {
    form,
    columns,
    dataTable,
    editTab,
    setEditTab,
    idEdit,
    loading,
    handleEdit,
    handleSubmit,
    handleSearch, // Expose the handleSearch function
  };
};

export default SubmitIP;
