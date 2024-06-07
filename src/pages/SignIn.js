/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  message,
} from "antd";
import signinbg from "../assets/images/Logo-VNPT.png";
import ServiceUser, { userLogin } from "../service/ServiceUser";
import { useState } from "react";

const { Title } = Typography;
const { Content } = Layout;

const SignIn = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUserLogin = async () => {
    const data = {
      username: username,
      password: password,
    };

    try {
      const res = await ServiceUser.userLogin(data);
      if (res && res.access_token) {
        message.success("Đăng nhập thành công");
        localStorage.setItem("token", res.access_token);
        history.push("/");
      } else {
        message.error("Đăng nhập không thành công");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        message.error(error.response.data.detail.msg);
      } else {
        message.error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
      }
    }
  };
  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Đăng nhập</Title>
              <Title className="font-regular text-muted" level={5}>
                Nhập usernmae và password
              </Title>
              <Form layout="vertical" className="row-col">
                <Form.Item
                  className="username"
                  label="Username"
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input placeholder="Admin or root" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input placeholder="Password" />
                </Form.Item>

                {/* <Form.Item
                    name="remember"
                    className="aligin-center"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked onChange={onChange} />
                    Remember me
                  </Form.Item> */}

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    onClick={() => handleUserLogin()}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
                {/* <p className="font-semibold text-muted">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-dark font-bold">
                      Sign Up
                    </Link>
                  </p> */}
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
    </>
  );
};
export default SignIn;
