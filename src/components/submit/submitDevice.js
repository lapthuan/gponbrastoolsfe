import { Button, Input, Popconfirm, Space, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useAsync from '../../hook/useAsync';
import { useForm } from 'antd/es/form/Form';
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import ServiceIp from '../../service/ServiceIp';
import ServiceVlanIMS from '../../service/ServiceVlanIMS';
import ServiceVlanMyTV from '../../service/ServiceVlanMyTV';
import ServiceVlanNet from '../../service/ServiceVlanNet';
import ServiceDevice from '../../service/ServiceDevice';
import Highlighter from 'react-highlight-words';
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
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
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
            title: 'Loại thiết bị',
            dataIndex: 'loaithietbi',
            key: 'loaithietbi',
            filters: [
                {
                    text: 'GPON HW',
                    value: 'GPON HW',
                },
                {
                    text: 'GPON MINI HW',
                    value: 'GPON MINI HW',
                },
                {
                    text: 'GPON ZTE',
                    value: 'GPON ZTE',
                },
                {
                    text: 'GPON MINI ZTE',
                    value: 'GPON MINI ZTE',
                },
                {
                    text: 'GPON ALU',
                    value: 'GPON ALU',
                },
            ],
        
            onFilter: (value, record) => record.loaithietbi.includes(value),
        },
        {
            title: 'Tên thiết bị',
            dataIndex: 'tenthietbi',
            key: 'tenthietbi',
            ...getColumnSearchProps('tenthietbi'),
        },
        {
            title: 'Ip',
            dataIndex: 'ipaddress',
            key: 'ipaddress',
            ...getColumnSearchProps('ipaddress'),
        },
        {
            title: 'Vlan IMS',
            dataIndex: 'vlanims',
            key: 'vlanims',
            ...getColumnSearchProps('vlanims'),
        },
        {
            title: 'Vlan MyTV',
            dataIndex: 'vlanmytv',
            key: 'vlanmytv',
            ...getColumnSearchProps('vlanmytv'),
        },
        {
            title: 'Vlan Net',
            dataIndex: 'vlannet',
            key: 'vlannet',
            ...getColumnSearchProps('vlannet'),
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