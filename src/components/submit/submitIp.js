import { Button, Popconfirm, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import useAsync from '../../hook/useAsync';
import { useForm } from 'antd/es/form/Form';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ServiceIp from '../../service/ServiceIp';

const SubmitIP = () => {
    const [dataTable, setData] = useState([])
    const [editTab, setEditTab] = useState(false)
    const [idEdit, setIdEdit] = useState()

    const { data, loading } = useAsync(() => ServiceIp.getAllIp())
    const [form] = useForm();


    useEffect(() => {
        if (data) {
            const datatab = data.map((item, i) => {
                return {
                    _id: item._id,
                    ipaddress: item.ipaddress,
                    key: item._id
                }
            });
            setData(datatab);
        }
    }, [data]);
    const ChangeEdit = async (_id, ipaddress) => {


        await setIdEdit(_id);
        form.setFieldsValue({
            ipaddress: ipaddress
        });
        setEditTab(true);

    }
    const handleEdit = async () => {
        const ipaddress = form.getFieldValue('ipaddress');
        if (ipaddress) {
            const res = await ServiceIp.editIp({ ipaddress: ipaddress }, idEdit)
            if (res.detail.msg === "success") {
                message.success("Sửa thành công thành công")
                const datatab =  await res.detail.data.map((item, i) => {
                    return {
                        _id: item._id,
                        ipaddress: item.ipaddress,
                        key: item._id
                    }
                });
                setData(datatab);
            } else {
                message.error("Địa chỉ ip không hợp lệ")
            }
        } else {
            message.error("Dữ liệu bỏ trống")

        }
    }
    const handleDelete = async (_id) => {
        const res = await ServiceIp.deleteIp(_id)
        if (res.detail.msg === "success") {
            message.success("Xóa thành công")
            const datatab =  await res.detail.data.map((item, i) => {
                return {
                    _id: item._id,
                    ipaddress: item.ipaddress,
                    key: item._id
                }
            });
            setData(datatab);
        } else {
            message.error("Lỗi")
        }
    }
    const handleSubmit = async () => {
        const ipaddress = form.getFieldValue('ipaddress');
        if (ipaddress) {
            const res = await ServiceIp.createIp({ ipaddress: ipaddress })

            if (res.detail.msg === "success") {
                message.success("Thêm thành công")
                const datatab =  await res.detail.data.map((item, i) => {
                    return {
                        _id: item._id,
                        ipaddress: item.ipaddress,
                        key: item._id
                    }
                });
                setData(datatab);
            } else {
                message.error("Địa chỉ ip không hợp lệ")
            }
        } else {
            message.error("Dữ liệu bỏ trống")

        }

    };
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (id) => (
                <p>{id.slice(-6)}</p>
            )
        },
        {
            title: 'Ip',
            dataIndex: 'ipaddress',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: "Công cụ",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => ChangeEdit(record._id, record.ipaddress)} style={{ backgroundColor: 'green', borderColor: 'green' }}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa"
                        description="Bạn có chắc chắn xóa?"
                        onConfirm={() => handleDelete(record._id)}
                        icon={
                            <QuestionCircleOutlined
                                style={{
                                    color: 'red',
                                }}
                            />
                        }
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Space >
            )
        }
    ];

    return {
        form,
        columns,
        dataTable,
        editTab,
        setEditTab,
        idEdit,
        loading,
        handleEdit,
        handleSubmit
    };
}

export default SubmitIP;