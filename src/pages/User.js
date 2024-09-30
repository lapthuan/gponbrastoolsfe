import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Switch, Table } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import ServiceUser from "../service/ServiceUser";
import useAsync from "../hook/useAsync";

const User = () => {
    const [form] = useForm()
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [data, setData] = useState([]);
    const onFinish = async (values) => {
        setLoading(true)
        try {
            const data =
            {
                fullname: values.fullname,
                username: values.username,
                password: checked === true ? "vnptvlg" : values.password,
                role: values.role
            }

            const res = await ServiceUser.userSignup(data);

            if (res) {
                message.success("Tạo tài khoản thành công");
                setLoading(false)
                const resUser = await ServiceUser.getAllUser()
                setData(resUser)
                form.resetFields()
                setOpenModal(false)

            }

        } catch (error) {
            console.log(error)
            if (error.response.data.detail.msg === "Không thể tạo người dùng mới") {
                message.warning("Tài khoản đã tồn tại");
                setLoading(false)
            }

        }
    }

    const { data: dataUser, loading: loadingUser } = useAsync(() => ServiceUser.getAllUser())
    useEffect(() => {
        setData(dataUser)
    }, [dataUser])

    const columns = [
        {
            title: "STT",
            dataIndex: "_id",
            key: "_id",
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
            title: "Quyền",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Chức năng",
            dataIndex: "action",
            key: "action",
            render: (text, record) => (
                <Button danger onClick={() => showDeleteModal(record)}>
                    Xóa tài khoản
                </Button>
            ),
        },
    ]
    // Hiển thị modal xác nhận xóa
    const showDeleteModal = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };

    // Xác nhận xóa tài khoản
    const handleDelete = async () => {
        if (selectedRecord.role === "admin") {
            message.warning("Tài khoản là Admin không thể xóa")
            return
        }
        try {

            const res = await ServiceUser.delectUser(selectedRecord._id)
            if (res) {
                setData(res.detail.data)
                message.success("Xóa tài khoản thành công")
                setIsModalVisible(false);
            }

        } catch (error) {
            console.log(error);

            message.error("Lỗi")
        }

    };

    // Hủy hành động xóa
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="layout-content">
            <Row gutter={[24, 0]}>

                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                    <Card bordered={false} className="criclebox h-full" title="Chức năng">
                        <Button type="primary" onClick={() => setOpenModal(true)}> Thêm tài khoản</Button>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                    <Table loading={loadingUser} dataSource={data} columns={columns} />
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

                        label="Quyền"
                        name="role"
                        initialValue={'user'}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn quyền!",
                            },
                        ]}
                    >
                        <Select

                            style={{ width: "100%" }}
                            placeholder="Chọn quyền"

                        >

                            <Select.Option value={'user'}>
                                User
                            </Select.Option>
                            <Select.Option value={'user bras'}>
                                User Bras
                            </Select.Option>
                            <Select.Option value={'user gpon'}>
                                User Gpon
                            </Select.Option>
                            <Select.Option value={'admin'}>
                                Admin
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Switch checkedChildren="Mật khẩu mặc định" unCheckedChildren="Mặt khẩu khác" onChange={(checked) => setChecked(checked)} style={{ marginBottom: 10 }} defaultChecked />

                    {checked === true ? (<><p>Mật khẩu mặc định là <strong><i>vnptvlg</i></strong></p></>) : (<Form.Item
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
                    </Form.Item>)}


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
            <Modal
                title="Xác nhận xóa tài khoản"
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa tài khoản <b>{selectedRecord?.username}</b> không?</p>
            </Modal>
        </div >);
}

export default User;