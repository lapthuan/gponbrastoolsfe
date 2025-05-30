import { Button, Card, Col, Form, Input, Row, Select, Table } from "antd";
import SubmitDevice from "../components/submit/submitDevice.js";
import { useState } from "react";

const Device = () => {
  const {
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
    dataIp,
    dataVlanIMS,
    dataVlanMyTV,
    dataVlanNet,
    loadingIp,
    loadingVlanIMS,
    loadingVlanMyTV,
    loadingVlanNet,
  } = SubmitDevice();

  const [pagination, setPagination] = useState({
    pageSize: 6,
    current: 1,
  });

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...pagination,
      current: pagination.pageSize !== prev.pageSize ? 1 : pagination.current, // Reset về trang 1 nếu đổi pageSize
    }));
  };

  const filterOption = (input, option) => {
    return option.children
      ? option.children.toString().toLowerCase().includes(input.toLowerCase())
      : false;
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={6} xl={5} className="mb-24">
          {editTab === false ? (
            <Card title="Thêm dữ liệu" bordered={true}>
              <Form
                form={form}
                initialValues={{
                  size: "small",
                }}
                layout="vertical"
                size={"small"}
                className="form-card"
                onFinish={onFinish}
              >
                <Form.Item
                  label="Loại TB"
                  name="loaithietbi"
                  rules={[
                    { required: true, message: "Hãy Chọn loại thiết bị" },
                  ]}
                  style={{ marginBottom: 10 }}
                  className="select-item"
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn loại thiết bị"
                  >
                    <Select.Option value="GPON ALU">GPON ALU</Select.Option>
                    <Select.Option value="GPON HW">GPON HW</Select.Option>
                    <Select.Option value="GPON MINI HW">
                      GPON Mini HW
                    </Select.Option>
                    <Select.Option value="GPON MINI ZTE">
                      GPON Mini ZTE
                    </Select.Option>
                    <Select.Option value="GPON ZTE">GPON ZTE</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Tên TB"
                  name="tenthietbi"
                  rules={[{ required: true, message: "Chưa nhập tên TB" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Input placeholder="Nhập tên TB" />
                </Form.Item>
                <Form.Item
                  label="Ip"
                  name="ipaddress"
                  rules={[{ required: true, message: "Hãy Chọn Ip" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn Ip"
                    loading={loadingIp}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {dataIp?.map((item, i) => (
                      <Select.Option key={i + 1} value={item._id}>
                        {item.ipaddress}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Vlan IMS"
                  name="vlanims"
                  rules={[{ required: true, message: "Hãy Chọn Vlan IMS" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "100%" }}
                    placeholder="Chọn Vlan IMS"
                    loading={loadingVlanIMS}
                  >
                    {dataVlanIMS?.map((item, i) => (
                      <Select.Option key={i + 1} value={item._id}>
                        {item.number}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Vlan MyTV"
                  name="vlanmytv"
                  rules={[{ required: true, message: "Hãy Chọn Vlan MyTV" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "100%" }}
                    placeholder="Chọn Vlan MyTV"
                    loading={loadingVlanMyTV}
                  >
                    {dataVlanMyTV?.map((item, i) => (
                      <Select.Option key={i + 1} value={item._id}>
                        {item.number}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Vlan Net"
                  name="vlannet"
                  rules={[{ required: true, message: "Hãy Chọn Vlan Net" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "100%" }}
                    placeholder="Chọn Vlan Net"
                    loading={loadingVlanNet}
                  >
                    {dataVlanNet?.map((item, i) => (
                      <Select.Option key={i + 1} value={item._id}>
                        {item.number}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  loading={loadingButton}
                  htmlType="submit"
                >
                  Thêm
                </Button>
              </Form>
            </Card>
          ) : (
            <Card title="Sửa dữ liệu" bordered={true}>
              <i>Sửa dữ liệu của id: {idEdit.slice(-6)}</i>
              <Form
                form={form}
                initialValues={{
                  size: "small",
                }}
                layout="vertical"
                size={"small"}
                className="form-card"
                onFinish={handleEdit}
              >
                <Form.Item
                  label="Loại TB"
                  name="loaithietbi"
                  rules={[
                    { required: true, message: "Hãy Chọn loại thiết bị" },
                  ]}
                  style={{ marginBottom: 10 }}
                  className="select-item"
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn loại thiết bị"
                  >
                    <Select.Option value="GPON ALU">GPON ALU</Select.Option>
                    <Select.Option value="GPON HW">GPON HW</Select.Option>
                    <Select.Option value="GPON MINI HW">
                      GPON Mini HW
                    </Select.Option>
                    <Select.Option value="GPON MINI ZTE">
                      GPON Mini ZTE
                    </Select.Option>
                    <Select.Option value="GPON ZTE">GPON ZTE</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Tên TB"
                  name="tenthietbi"
                  rules={[{ required: true, message: "Chưa nhập tên TB" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Ip"
                  name="ipaddress"
                  rules={[{ required: true, message: "Hãy Chọn Ip" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    style={{ width: "100%" }}
                    placeholder="Chọn Ip"
                    loading={loadingIp}
                  >
                    {dataIp?.map((item, i) => (
                      <Select.Option key={i + 1} value={item._id}>
                        {item.ipaddress}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Vlan IMS"
                  name="vlanims"
                  rules={[{ required: true, message: "Hãy Chọn Vlan IMS" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "100%" }}
                    placeholder="Chọn Vlan IMS"
                    loading={loadingVlanIMS}
                  >
                    {dataVlanIMS?.map((item, i) => (
                      <Select.Option key={i + 1} value={item._id}>
                        {item.number}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Vlan MyTV"
                  name="vlanmytv"
                  rules={[{ required: true, message: "Hãy Chọn Vlan MyTV" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "100%" }}
                    placeholder="Chọn Vlan MyTV"
                    loading={loadingVlanMyTV}
                  >
                    {dataVlanMyTV?.map((item, i) => (
                      <Select.Option key={i + 1} value={item._id}>
                        {item.number}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Vlan Net"
                  name="vlannet"
                  rules={[{ required: true, message: "Hãy Chọn Vlan Net" }]}
                  className="select-item"
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "100%" }}
                    placeholder="Chọn Vlan Net"
                    loading={loadingVlanNet}
                  >
                    {dataVlanNet?.map((item, i) => (
                      <Select.Option key={i + 1} value={item._id}>
                        {item.number}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  loading={loadingButton}
                  htmlType="submit"
                >
                  Sửa
                </Button>
                <Button onClick={() => setEditTab(false)}>Trở về thêm</Button>
              </Form>
            </Card>
          )}
        </Col>
        <Col xs={24} sm={24} md={12} lg={18} xl={19} className="mb-24">
          <Table
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ["5", "6", "10", "20", "50", "100"],
            }}
            onChange={handleTableChange}
            columns={columns}
            dataSource={dataTable.slice().reverse()}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Device;
