import { Button, Popconfirm, Space, message } from "antd";
import { useEffect, useState } from "react";
import useAsync from "../../hook/useAsync";
import { useForm } from "antd/es/form/Form";
import { QuestionCircleOutlined } from "@ant-design/icons";
import ServiceDeviceType from "../../service/ServiceDeviceType";

const SubmitDeviceType = () => {
  const [dataTable, setData] = useState([]);
  const [editTab, setEditTab] = useState(false);
  const [idEdit, setIdEdit] = useState();

  const { data, loading } = useAsync(() =>
    ServiceDeviceType.getAllDeviceType()
  );
  const [form] = useForm();

  useEffect(() => {
    if (data) {
      const datatab = data.map((item, i) => {
        return {
          _id: item._id,
          typename: item.typename,
          key: item._id,
        };
      });
      setData(datatab);
    }
  }, [data]);

  const ChangeEdit = async (_id, typename) => {
    await setIdEdit(_id);
    form.setFieldsValue({
      typename: typename,
    });
    setEditTab(true);
  };

  const handleEdit = async () => {
    const typename = form.getFieldValue("typename");
    if (typename) {
      const res = await ServiceDeviceType.editDeviceType(
        { typename: typename },
        idEdit
      );
      if (res.detail.msg === "success") {
        message.success("Sửa thành công ");
        const datatab = await res.detail.data.map((item, i) => {
          return {
            _id: item._id,
            typename: item.typename,
            key: item._id,
          };
        });
        setData(datatab);
      } else {
        message.error("Đa xảy ra lỗi");
      }
    } else {
      message.error("Không tìm thấy loại thiết bị");
    }
  };

  const handleDelete = async (_id) => {
    const res = await ServiceDeviceType.deleteDeviceType(_id);
    if (res.detail.msg === "success") {
      message.success("Xóa thành công");
      const datatab = await res.detail.data.map((item, i) => {
        return {
          _id: item._id,
          typename: item.typename,
          key: item._id,
        };
      });
      setData(datatab);
    } else {
      message.error("Lỗi");
    }
  };

  const handleSubmit = async () => {
    const typename = form.getFieldValue("typename");
    if (typename) {
      const res = await ServiceDeviceType.createDeviceType({
        typename: typename,
      });

      if (res.detail.msg === "success") {
        message.success("Thêm thành công");
        const datatab = await res.detail.data.map((item, i) => {
          return {
            _id: item._id,
            typename: item.typename,
            key: item._id,
          };
        });
        setData(datatab);
      } else {
        message.error("Lỗi");
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
      title: "Lọại thiết bị",
      dataIndex: "typename",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Công cụ",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => ChangeEdit(record._id, record.typename)}
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

export default SubmitDeviceType;
