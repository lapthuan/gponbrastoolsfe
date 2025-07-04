import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import SubmitDevice from "../components/submit/submitDevice.js";
import { useState } from "react";
import useAsync from "../hook/useAsync.js";
import ServiceDeviceType from "../service/ServiceDeviceType.js";

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
  } = SubmitDevice();

  //Load loại thiết bị
  const { data: dataDeviceType } = useAsync(() =>
    ServiceDeviceType.getAllDeviceType()
  );

  const [pagination, setPagination] = useState({
    pageSize: 6,
    current: 1,
  });

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...pagination,
      current: pagination.pageSize !== prev.pageSize ? 1 : pagination.current,
    }));
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={6} xl={5} className="mb-24">
          <Card
            title={editTab ? "Sửa dữ liệu" : "Thêm dữ liệu"}
            bordered={true}
          >
            {editTab && <i>Sửa dữ liệu của ID: {idEdit.slice(-6)}</i>}
            <Form
              form={form}
              initialValues={{ size: "small" }}
              layout="vertical"
              size="small"
              className="form-card"
              onFinish={editTab ? handleEdit : onFinish}
            >
              <Form.Item
                label="Loại TB"
                name="loaithietbi"
                rules={[{ required: true, message: "Hãy chọn loại thiết bị" }]}
              >
                <Select placeholder="Chọn loại thiết bị">
                  {dataDeviceType?.map((device) => (
                    <Select.Option key={device._id} value={device.typename}>
                      {device.typename}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Tên TB"
                name="tenthietbi"
                rules={[{ required: true, message: "Chưa nhập tên thiết bị" }]}
              >
                <Input placeholder="Nhập tên thiết bị" />
              </Form.Item>

              <Form.Item
                label="IP Address"
                name="ipaddress"
                rules={[{ required: true, message: "Chưa nhập IP" }]}
              >
                <Input placeholder="Nhập IP thiết bị" />
              </Form.Item>

              <Form.Item
                label="VLAN Net"
                name="vlannet"
                rules={[{ required: true, message: "Chưa nhập VLAN Net" }]}
              >
                <Input placeholder="Nhập VLAN Net" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="VLAN IMS"
                    name="vlanims"
                    rules={[{ required: true, message: "Chưa nhập VLAN IMS" }]}
                  >
                    <Input placeholder="Nhập VLAN IMS" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="VLAN MyTV"
                    name="vlanmytv"
                    rules={[{ required: true, message: "Chưa nhập VLAN MyTV" }]}
                  >
                    <Input placeholder="Nhập VLAN MyTV" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  loading={loadingButton}
                  htmlType="submit"
                  style={{ marginRight: 8 }}
                >
                  {editTab ? "Sửa" : "Thêm"}
                </Button>
                {editTab && (
                  <Button onClick={() => setEditTab(false)}>Trở về thêm</Button>
                )}
              </Form.Item>
            </Form>
          </Card>
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
