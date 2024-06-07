import { Button, Popconfirm, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import useAsync from '../../hook/useAsync';
import { useForm } from 'antd/es/form/Form';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ServiceIp from '../../service/ServiceIp';
import ServiceVlanIMS from '../../service/ServiceVlanIMS';
import ServiceVlanMyTV from '../../service/ServiceVlanMyTV';
import ServiceVlanNet from '../../service/ServiceVlanNet';
import ServiceDevice from '../../service/ServiceDevice';

const SubmitDevice = () => {
    const [dataTable, setData] = useState([])
    const [editTab, setEditTab] = useState(false)
    const [idEdit, setIdEdit] = useState()
    const [loadingButton, setLoadingButton] = useState(false);
    const { data, loading } = useAsync(() => ServiceDevice.getAlldevice())
    const [form] = useForm();
    const { data: dataIp, loading: loadingIp } = useAsync(() => ServiceIp.getAllIp())
    const { data: dataVlanIMS, loading: loadingVlanIMS } = useAsync(() => ServiceVlanIMS.getAllVlanIMS())
    const { data: dataVlanMyTV, loading: loadingVlanMyTV } = useAsync(() => ServiceVlanMyTV.getAllVlanMyTV())
    const { data: dataVlanNet, loading: loadingVlanNet } = useAsync(() => ServiceVlanNet.getAllVlanNet())


    useEffect(() => {
        const datatab = data.map((item, i) => {
            return {
                _id: item._id,
                ipaddress: item.ipaddress?.number || "",
                vlanims: item.vlanims?.number || "",
                vlanmytv: item.vlanmytv?.number || "",
                vlannet: item.vlannet?.number || "",
                loaithietbi: item.loaithietbi || "",
                tenthietbi: item.tenthietbi || "",
                idip: item.ipaddress?._id || "",
                idvlanims: item.vlanims?._id || "",
                idvlanmytv: item.vlanmytv?._id || "",
                idvlannet: item.vlannet?._id || "",
                key: item._id || ""
            }

        });
        setData(datatab)
    }, [data])
    const ChangeEdit = async (rc) => {
        await setIdEdit(rc._id);

        form.setFieldsValue({
            loaithietbi: rc.loaithietbi,
            tenthietbi: rc.tenthietbi,
            ipaddress: rc.idip,
            vlanims: rc.idvlanims,
            vlanmytv: rc.idvlanmytv,
            vlannet: rc.idvlannet,
        });
        setEditTab(true);

    }
    const handleEdit = async (values) => {

        setLoadingButton(true)
        message.loading("Đang xử lý")
        const res = await ServiceDevice.editDevice(values, idEdit)
        if (res.detail.msg === "success") {
            message.success("Sửa dữ liệu thành công")
            const datatab = await res.detail.data.map((item, i) => {
                return {
                    _id: item._id,
                    ipaddress: item.ipaddress.number,
                    vlanims: item.vlanims.number,
                    vlanmytv: item.vlanmytv.number,
                    vlannet: item.vlannet.number,
                    loaithietbi: item.loaithietbi,
                    tenthietbi: item.tenthietbi,
                    idip: item.ipaddress._id,
                    idvlanims: item.vlanims._id,
                    idvlanmytv: item.vlanmytv._id,
                    idvlannet: item.vlannet._id,
                    key: item._id
                }

            });
            setData(datatab)
            setEditTab(false)
            form.setFieldsValue({
                loaithietbi: "",
                tenthietbi: "",
                ipaddress: "",
                vlanims: "",
                vlanmytv: "",
                vlannet: "",
            });
            setLoadingButton(false)
        } else {
            message.error("Lỗi")
        }
    }
    const handleDelete = async (_id) => {
        const res = await ServiceDevice.deleteDevice(_id)
        if (res.detail.msg === "success") {
            message.success("Xóa thành công")
            const datatab = await res.detail.data.map((item, i) => {
                return {
                    _id: item._id,
                    ipaddress: item.ipaddress.number,
                    vlanims: item.vlanims.number,
                    vlanmytv: item.vlanmytv.number,
                    vlannet: item.vlannet.number,
                    loaithietbi: item.loaithietbi,
                    tenthietbi: item.tenthietbi,
                    idip: item.ipaddress._id,
                    idvlanims: item.vlanims._id,
                    idvlanmytv: item.vlanmytv._id,
                    idvlannet: item.vlannet._id,
                    key: item._id
                }

            });
            setData(datatab)
        } else {
            message.error("Lỗi")
        }
    }

    const onFinish = async (values) => {
        setLoadingButton(true)
        message.loading("Đang xử lý")
        const res = await ServiceDevice.createDevice(values)
        if (res.detail.msg === "success") {
            message.success("Thêm thành công")
            const datatab = await res.detail.data.map((item, i) => {
                return {
                    _id: item._id,
                    ipaddress: item.ipaddress.number,
                    vlanims: item.vlanims.number,
                    vlanmytv: item.vlanmytv.number,
                    vlannet: item.vlannet.number,
                    loaithietbi: item.loaithietbi,
                    tenthietbi: item.tenthietbi,
                    idip: item.ipaddress._id,
                    idvlanims: item.vlanims._id,
                    idvlanmytv: item.vlanmytv._id,
                    idvlannet: item.vlannet._id,
                    key: item._id
                }

            });
            setData(datatab)
            form.setFieldsValue({
                loaithietbi: "",
                tenthietbi: "",
                ipaddress: "",
                vlanims: "",
                vlanmytv: "",
                vlannet: "",
            });
            setLoadingButton(false)

        } else {
            message.error("Lỗi")
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
            title: 'Loại thiết bị',
            dataIndex: 'loaithietbi',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Tên thiết bị',
            dataIndex: 'tenthietbi',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Ip',
            dataIndex: 'ipaddress',
        },
        {
            title: 'Vlan IMS',
            dataIndex: 'vlanims',
        },
        {
            title: 'Vlan MyTV',
            dataIndex: 'vlanmytv',
        },
        {
            title: 'Vlan Net',
            dataIndex: 'vlannet',
        },
        {
            title: "Công cụ",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => ChangeEdit(record)} style={{ backgroundColor: 'green', borderColor: 'green' }}>
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
        onFinish,
        columns,
        dataTable,
        editTab,
        setEditTab,
        idEdit,
        loading,
        handleEdit,
        loadingButton,
        dataIp,
        dataVlanIMS,
        dataVlanMyTV,
        dataVlanNet,
        loadingIp,
        loadingVlanIMS,
        loadingVlanMyTV,
        loadingVlanNet,
    };
}

export default SubmitDevice;