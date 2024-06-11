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
import ServiceUser from "../service/ServiceUser";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;

const cookies = new Cookies();

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleUserLogin = async () => {
    const data = {
      username: username,
      password: password,
    };
    try {
      const res = await ServiceUser.userLogin(data);
      if (res.access_token) {
        cookies.set("token", res.access_token, { path: "/" });
        history.push("/"); // Chuyển hướng sau khi đăng nhập thành công
        message.success("Đăng nhập thành công");
      } else {
        message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
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
              Nhập username và password
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
                onChange={(e) => setPassword(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input placeholder="Password" type="password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  onClick={handleUserLogin}
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

export default SignIn;
