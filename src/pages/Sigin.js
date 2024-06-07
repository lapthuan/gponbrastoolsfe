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
      console.log(res);
      if (res && res.access_token) {
        message.success("Đăng nhập thành công");
        localStorage.setItem("token", res.access_token);
        history.push("/");
      } else {
        message.error("Đăng nhập không thành công");
      }
    } catch (error) {
      console.error("Login error:", error);
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
                Nhập username và password
              </Title>
              <Form layout="vertical" className="row-col">
                <Form.Item
                  className="username"
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Admin or root"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
    </>
  );
};

export default SignIn;
