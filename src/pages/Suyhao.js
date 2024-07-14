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

import SubmitGoogleSheet from "../components/submit/submitGoogleSheet";

const GoogleSheet = () => {
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
    handleUpdateSheets,
    loadingUpdate,
  } = SubmitGoogleSheet();

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
          {editTab === false ? (
            <Card title="Thêm dữ liệu" bordered={true}>
              <Form
                form={form}
                labelCol={{ span: 10 }}
                initialValues={{
                  size: "small",
                }}
                layout="horizontal"
                size={"small"}
                className="form-card"
              >
                <Form.Item
                  label="Sheet name:"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên Sheet!" },
                  ]}
                  className="select-item"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mã liên kết :"
                  name="link"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã liên kết!" },
                  ]}
                  className="select-item"
                >
                  <Input />
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
                labelCol={{ span: 10 }}
                initialValues={{
                  size: "small",
                }}
                layout="horizontal"
                size={"small"}
                className="form-card"
              >
                <Form.Item
                  label="Sheet name :"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên Sheet!" },
                  ]}
                  className="select-item"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mã liên kết :"
                  name="link"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã liên kết!" },
                  ]}
                  className="select-item"
                >
                  <Input />
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
          <Card
            title="Cập nhật sheet"
            bordered={true}
            style={{ marginTop: "10px" }}
          >
            <Form form={form}>
              <Form.Item
                label="Sheet"
                name="google_sheet_id"
                rules={[{ required: true, message: "Hãy chọn sheet" }]}
                className="select-item"
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Chọn sheet"
                  loading={loading}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {dataTable?.map((item, i) => (
                    <Select.Option key={i + 1} value={item.link}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Space size="middle">
                <Button
                  type="primary"
                  onClick={handleUpdateSheets}
                  loading={loadingUpdate}
                >
                  {loadingUpdate ? "Loading" : "Cập nhật"}
                </Button>
              </Space>
            </Form>
          </Card>
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

export default GoogleSheet;
