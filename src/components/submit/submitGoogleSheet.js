import { Button, Popconfirm, Space, message } from "antd";
import { useEffect, useState } from "react";
import useAsync from "../../hook/useAsync";
import { useForm } from "antd/es/form/Form";
import { QuestionCircleOutlined } from "@ant-design/icons";
import ServiceGgSheet from "../../service/ServiceSuyHao";

const SubmitGoogleSheet = () => {
  const [dataTable, setData] = useState([]);
  const [editTab, setEditTab] = useState(false);
  const [idEdit, setIdEdit] = useState();

  const { data, loading } = useAsync(() => ServiceGgSheet.getAllGgSheets());
  const [form] = useForm();

  useEffect(() => {
    if (data) {
      const datatab = data.map((item, i) => {
        return {
          _id: item._id,
          name: item.name,
          link: item.link,
          key: item._id,
        };
      });
      setData(datatab);
    }
  }, [data]);
  const ChangeEdit = async (_id, name, link) => {
    await setIdEdit(_id);
    form.setFieldsValue({
      name: name,
      link: link,
    });
    setEditTab(true);
  };

  const handleEdit = async () => {
    const name = form.getFieldsValue("name");
    console.log(name);
    if (name) {
      const res = await ServiceGgSheet.editGgSheet(name, idEdit);
      if (res.detail.msg === "success") {
        message.success("Sửa thành công");
        const datatab = await res.detail.data.map((item, i) => {
          return {
            _id: item._id,
            name: item.name,
            link: item.link,
            key: item._id,
          };
        });
        setData(datatab);
      } else {
        message.error("Đã xảy ra lỗi");
      }
    } else {
      message.error("Dữ liệu bỏ trống");
    }
  };
  const handleDelete = async (_id) => {
    const res = await ServiceGgSheet.deleteGgsheet(_id);
    if (res.detail.msg === "success") {
      message.success("Xóa thành công");
      const datatab = await res.detail.data.map((item, i) => {
        return {
          _id: item._id,
          name: item.name,
          link: item.link,
          key: item._id,
        };
      });
      setData(datatab);
    } else {
      message.error("Lỗi");
    }
  };

  const handleSubmit = async () => {
    const name = form.getFieldsValue("name");
    if (name) {
      const res = await ServiceGgSheet.createGgSheet(name);

      if (res.detail.msg === "success") {
        message.success("Thêm thành công");
        const datatab = res.detail.data.map((item, i) => {
          return {
            _id: item._id,
            name: item.name,
            link: item.link,
            key: item._id,
          };
        });
        setData(datatab);
      } else {
        message.error("Đã xảy ra lỗi");
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
      title: "Sheet name",
      dataIndex: "name",
      sorter: (a, b) => a.name - b.name,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Mã liên kết",
      dataIndex: "link",
      sorter: (a, b) => a.link - b.link,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Công cụ",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => ChangeEdit(record._id, record.name, record.link)}
            style={{ backgroundColor: "green", borderColor: "green" }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc chắn xóa?"
            onConfirm={() => handleDelete(record._id)}
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
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
  };
};

export default SubmitGoogleSheet;
