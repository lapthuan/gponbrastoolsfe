import React from "react";
import { Button, Card, Col, Form, Input, Row, Space, Table } from "antd";
import SubmitIP from "../components/submit/submitIp.js";

const { Search } = Input;

const IpAddress = () => {
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
    handleSearch, // Import the handleSearch function
  } = SubmitIP();

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
          {editTab === false ? (
            <Card title="Thêm dữ liệu" bordered={true}>
              <Form
                form={form}
                labelCol={{ span: 6 }}
                initialValues={{ size: "small" }}
                layout="horizontal"
                size={"small"}
                className="form-card"
              >
                <Form.Item
                  label="IP :"
                  name="ipaddress"
                  tooltip="Nhập đúng định dạng IPv4"
                  rules={[{ required: true, message: "Vui lòng nhập Ip!" }]}
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
                labelCol={{ span: 6 }}
                initialValues={{ size: "small" }}
                layout="horizontal"
                size={"small"}
                className="form-card"
              >
                <Form.Item
                  label="IP :"
                  tooltip="Nhập đúng định dạng IPv4"
                  name="ipaddress"
                  rules={[{ required: true, message: "Vui lòng nhập Ip!" }]}
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
          <Card title="Tìm kiếm" bordered={true} style={{ marginTop: "10px" }}>
            <Search
              placeholder="Nhập ip cần tìm"
              onChange={(e) => handleSearch(e.target.value)}
              enterButton
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={18} xl={18} className="mb-24">
          <Card bordered={true}>
            <Table
     
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

export default IpAddress;
