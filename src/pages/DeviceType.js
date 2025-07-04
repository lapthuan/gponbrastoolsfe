import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Table,
} from "antd";
import SubmitDeviceType from "../components/submit/submitDeviceType.js";

const DeviceType = () => {
  const {
    form,
    columns,
    dataTable,
    editTab,
    setEditTab,
    idEdit,
    loading,
    handleEdit,
    handleSubmit,
  } = SubmitDeviceType();

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
          {editTab === false ? (
            <Card title="Thêm dữ liệu" bordered={true}>
              <Form
                form={form}
                labelCol={{ span: 8 }}
                initialValues={{
                  size: "small",
                }}
                layout="vertical"
                size={"small"}
                className="form-card"
              >
                <Form.Item
                  label="Tên loại TB:"
                  name="typename"
                  rules={[
                    { required: true, message: "Chưa nhập loại thiết bị" },
                  ]}
                >
                  <Input placeholder="Nhập loại thiết bị" />
                </Form.Item>

                <Button type="primary" onClick={handleSubmit}>
                  Thêm
                </Button>
              </Form>
            </Card>
          ) : (
            <Card title="Sửa dữ liệu" bordered={true}>
              <i>Sửa dữ liệu của id: {idEdit.slice(-6)}</i>
              <Form
                form={form}
                labelCol={{ span: 8 }}
                initialValues={{
                  size: "small",
                }}
                layout="vertical"
                size={"small"}
                className="form-card"
              >
                <Form.Item
                  label="Tên loại TB :"
                  name="typename"
                  rules={[
                    { required: true, message: "Vui lòng nhập loại thiết bị!" },
                  ]}
                  className="select-item"
                >
                  <Input placeholder="Nhập loại thiết bị" />
                </Form.Item>
                <Space size="middle">
                  <Button type="primary" onClick={handleEdit}>
                    Sửa
                  </Button>
                  <Button onClick={() => setEditTab(false)}>Trở về thêm</Button>
                </Space>
              </Form>
            </Card>
          )}
        </Col>
        <Col xs={24} sm={24} md={12} lg={18} xl={18} className="mb-24">
          <Card bordered={true}>
            <Table
              pagination={{ pageSize: 5 }}
              columns={columns}
              dataSource={dataTable.slice().reverse()}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceType;
