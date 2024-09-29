import { Button, Card, Col, Form, Input, message, Modal, Row, Table } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import ServiceUser from "../service/ServiceUser";

const User = () => {
    const [form] = useForm()
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const onFinish = async (values) => {
        setLoading(true)
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
                setLoading(false)

            }

        } catch (error) {
            console.log(error)
            if (error.response.data.detail.msg === "Không thể tạo người dùng mới") {
                message.warning("Tài khoản đã tồn tại");
                setLoading(false)
            }

        }
    }
    const columns = [
        {
            title: "STT",
            dataIndex: "key",
            key: "key",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Họ tên",
            dataIndex: "fullname",
            key: "fullname",

        },
        {
            title: "Tài khoản",
            dataIndex: "username",
            key: "username",

        },
        {
            title: "Chức năng",
            dataIndex: "action",
            key: "action",
            render: (text, record) => (
                <Button >Xóa tài khoản</Button>
            )
        },
    ]
    return (
        <div className="layout-content">
            <Row gutter={[24, 0]}>

                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                    <Card bordered={false} className="criclebox h-full" title="Chức năng">
                        <Button onClick={() => setOpenModal(true)}> Thêm tài khoản</Button>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                    <Table columns={columns} />
                </Col>
            </Row>
            <Modal title="Thêm tài khoản" onCancel={() => setOpenModal(false)} visible={openModal} footer={null}>
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
                            loading={loading}

                        >
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div >);
}

export default User;