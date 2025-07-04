import { Button, Input, Popconfirm, Space, message } from "antd";
import { useEffect, useRef, useState } from "react";
import useAsync from "../../hook/useAsync";
import { useForm } from "antd/es/form/Form";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import ServiceDevice from "../../service/ServiceDevice";
import Highlighter from "react-highlight-words";
import ServiceDeviceType from "../../service/ServiceDeviceType";

const SubmitDevice = () => {
  const [dataTable, setData] = useState([]);
  const [editTab, setEditTab] = useState(false);
  const [idEdit, setIdEdit] = useState();
  const [loadingButton, setLoadingButton] = useState(false);
  const { data, loading } = useAsync(() => ServiceDevice.getAlldevice());
  const [form] = useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  //Load loại thiết bị
  const { data: dataDeviceType } = useAsync(() =>
    ServiceDeviceType.getAllDeviceType()
  );

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100);
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    if (data) {
      const datatab = data.map((item) => ({
        key: item._id,
        ...item,
      }));
      setData(datatab);
    }
  }, [data]);

  const ChangeEdit = (record) => {
    setIdEdit(record._id);
    form.setFieldsValue({
      loaithietbi: record.loaithietbi,
      tenthietbi: record.tenthietbi,
      ipaddress: record.ipaddress,
      vlanims: record.vlanims,
      vlanmytv: record.vlanmytv,
      vlannet: record.vlannet,
    });
    setEditTab(true);
  };

  const handleEdit = async (values) => {
    setLoadingButton(true);
    message.loading("Đang xử lý");
    const res = await ServiceDevice.editDevice(values, idEdit);
    if (res.detail.msg === "success") {
      message.success("Sửa dữ liệu thành công");
      const datatab = res.detail.data.map((item) => ({
        key: item._id,
        ...item,
      }));
      setData(datatab);
      setEditTab(false);
      form.resetFields();
    } else {
      message.error("Lỗi");
    }
    setLoadingButton(false);
  };

  const handleDelete = async (_id) => {
    const res = await ServiceDevice.deleteDevice(_id);
    if (res.detail.msg === "success") {
      message.success("Xóa thành công");
      const datatab = res.detail.data.map((item) => ({
        key: item._id,
        ...item,
      }));
      setData(datatab);
    } else {
      message.error("Lỗi");
    }
  };

  const onFinish = async (values) => {
    setLoadingButton(true);
    message.loading("Đang xử lý");
    const res = await ServiceDevice.createDevice(values);
    if (res.detail.msg === "success") {
      message.success("Thêm thành công");
      const datatab = res.detail.data.map((item) => ({
        key: item._id,
        ...item,
      }));
      setData(datatab);
      form.resetFields();
    } else {
      message.error("Lỗi");
    }
    setLoadingButton(false);
  };

  const columns = [
    {
      title: "Loại thiết bị",
      dataIndex: "loaithietbi",
      key: "loaithietbi",
      filters: dataDeviceType.map((item) => ({
        text: item.typename,
        value: item.typename,
      })),
      onFilter: (value, record) => record.loaithietbi.includes(value),
    },
    {
      title: "Tên thiết bị",
      dataIndex: "tenthietbi",
      key: "tenthietbi",
      ...getColumnSearchProps("tenthietbi"),
    },
    {
      title: "IP",
      dataIndex: "ipaddress",
      key: "ipaddress",
      ...getColumnSearchProps("ipaddress"),
    },
    {
      title: "VLAN IMS",
      dataIndex: "vlanims",
      key: "vlanims",
      ...getColumnSearchProps("vlanims"),
    },
    {
      title: "VLAN MyTV",
      dataIndex: "vlanmytv",
      key: "vlanmytv",
      ...getColumnSearchProps("vlanmytv"),
    },
    {
      title: "VLAN Net",
      dataIndex: "vlannet",
      key: "vlannet",
      ...getColumnSearchProps("vlannet"),
    },
    {
      title: "Công cụ",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => ChangeEdit(record)}
            style={{ backgroundColor: "green", borderColor: "green" }}
          >
            Sửa
          </Button>
          <Popconfirm
            title={
              <span style={{ color: "#e53935", fontWeight: "bold" }}>
                <QuestionCircleOutlined /> Xác nhận xóa
              </span>
            }
            description="Bạn có chắc chắn muốn xóa thiết bị này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            okType="danger"
            cancelText="Hủy"
            placement="left"
            overlayStyle={{ maxWidth: 220 }}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return {
    form,
    onFinish,
    columns,
    dataTable,
    editTab,
    setEditTab,
    idEdit,
    loading,
    handleEdit,
    loadingButton,
  };
};

export default SubmitDevice;
