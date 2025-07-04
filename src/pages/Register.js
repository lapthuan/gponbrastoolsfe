import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  message,
} from "antd";
import signinbg from "../assets/images/Logo-VNPT.png";
import { useForm } from "antd/lib/form/Form";
import ServiceUser from "../service/ServiceUser";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
const { Title } = Typography;
const { Content } = Layout;

const Register = () => {
  const [form] = useForm();
  const history = useHistory();
  const onFinish = async (values) => {
    try {
      const data =
      {
        fullname: values.fullname,
        username: values.username,
        password: values.password,
        role: "user"
      }

      const res = await ServiceUser.userSignup(data);

      if (res) {
        message.success("Tạo tài khoản thành công");
      }

    } catch (error) {
      if (error.response.data.detail.msg === "Không thể tạo người dùng mới")
        message.warning("Tài khoản đã tồn tại");
    }
  }

  return (
    <Layout className="layout-default layout-signin">
      <Content className="signin">
        <Row gutter={[24, 0]} justify="space-around">
          <Col
            xs={{ span: 24, offset: 0 }}
            lg={{ span: 6, offset: 2 }}
            md={{ span: 12 }}
          >
            <Title className="mb-15">Đăng ký</Title>

            <Form form={form}
              onFinish={onFinish} layout="vertical" className="row-col">
              <Form.Item

                label="Họ tên"
                name="fullname"

                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ tên!",
                  },
                ]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
              <Form.Item

                label="Tài khoản"
                name="username"

                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tài khoản!",
                  },
                ]}
              >
                <Input placeholder="Nhập tài khoản" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"

                rules={[
                  {
                    required: true,
                    message: "vui lòng nhập mật khẩu!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Mật khẩu"

                  style={{
                    padding: "0px 11px 0px 11px",
                    borderRadius: "5px",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Nhập lại mật khẩu"
                name="passwordrp"
                dependencies={['password']} // thêm dependencies để kết hợp với trường 'password'
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "vui lòng nhập lại mật khẩu!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu"
                  style={{
                    padding: "0px 11px 0px 11px",
                    borderRadius: "5px",
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}

                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col
            className="sign-img"
            style={{ padding: 12 }}
            xs={{ span: 24 }}
            lg={{ span: 12 }}
            md={{ span: 12 }}
          >
            <img src={signinbg} alt="" />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Register;
