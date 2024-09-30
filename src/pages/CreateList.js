import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    InputNumber,
    message,
    Row,
    Select,
    Space,
    Table,
    Tabs,
} from "antd";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import ServiceDevice from "../service/ServiceDevice";
import ServiceIp from "../service/ServiceIp";
import useAsync from "../hook/useAsync";
import ServiceGpon from "../service/ServiceGpon";
import { TerminalOutput } from "react-terminal-ui";
import TerminalComponent from "../components/Terminal/TerminalComponent";
import { useForm } from "antd/lib/form/Form";
import ServiceVlanNet from "../service/ServiceVlanNet";
import ServiceVlanIMS from "../service/ServiceVlanIMS";
import ServiceVlanMyTV from "../service/ServiceVlanMyTV";
const { TabPane } = Tabs;

const CreateList = () => {
    const [form] = useForm();
    const [lineData, setLineData] = useState([
        <TerminalOutput key={"12312312312321312"}>
            {"typ:isadmin>#"}
        </TerminalOutput>,
    ]);
    const [data, setData] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [deviceType, setDeviceType] = useState("");
    const [devices, setDevices] = useState([]);
    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [selectDevices, setSelectDevices] = useState();
    const [ipAddress, setIpAddress] = useState();
    const [vlanNetOneDevice, setVlanNetOneDevice] = useState([]);
    const [loading, setLoading] = useState(false);
    const { data: dataIp, loading: loadingIp } = useAsync(() =>
        ServiceIp.getAllIp()
    );
    const { data: dataDevice, loading: loadingDevice } = useAsync(() =>
        ServiceDevice.getAlldevice()
    );
    const { data: dataVlanIMS, loading: loadingVlanIMS } = useAsync(() =>
        ServiceVlanIMS.getAllVlanIMS()
    );
    const { data: dataVlanMyTV, loading: loadingVlanMyTV } = useAsync(() =>
        ServiceVlanMyTV.getAllVlanMyTV()
    );

    const { data: dataVlanNet, loading: loadingVlanNet } = useAsync(() =>
        ServiceVlanNet.getAllVlanNet()
    );
    const handleServiceChange = (service, record) => {
        const newSelectedServices = { ...selectedServices };

        if (!newSelectedServices[record.key]) {
            newSelectedServices[record.key] = {};
        }

        newSelectedServices[record.key][service] = !newSelectedServices[record.key][service];

        setSelectedServices(newSelectedServices);
    };

    useEffect(() => {
        if (selectDevices) {
            const getADV = async () => {
                try {
                    const res = await ServiceDevice.getADevice(selectDevices);
                    setIpAddress(res.ipaddress);

                    const resVlanNet = await ServiceVlanNet.getManyVlanNet(res.tenthietbi)
                    setVlanNetOneDevice(resVlanNet)
                    form.setFieldsValue({
                        ipaddress: res.ipaddress,
                        vlanims: res.vlanims,
                        vlannet: res.vlannet,
                        vlanmytv: res.vlanmytv
                    });
                } catch (error) {
                    console.error("Error fetching device data:", error);
                }
            };

            getADV();
        }
    }, [selectDevices]);
    useEffect(() => {

        if (deviceType) {

            const getDevice = async () => {
                try {
                    const res = await ServiceDevice.getDevice(deviceType);

                    setDevices(res);
                } catch (error) {
                    console.error("Error fetching device data:", error);
                    // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo cho người dùng
                } finally {
                    setLoadingDevices(false);
                }
            };
            getDevice();
        }
    }, [deviceType]);
    const handleSelectAllForService = (service) => {
        setSelectedServices((prevState) => {
            const allSelected = data.every(
                (record) => prevState[record.key]?.[service]
            );
            const updatedServices = data.reduce((acc, record) => {
                acc[record.key] = {
                    ...prevState[record.key],
                    [service]: !allSelected,
                };
                return acc;
            }, {});
            return {
                ...prevState,
                ...updatedServices,
            };
        });
    };
    const handleSelectAllFunctions = (selectAll) => {
        setSelectedServices((prevState) => {
            const updatedServices = data.reduce((acc, record) => {
                acc[record.key] = {
                    ...prevState[record.key],

                    net: selectAll,
                    ims: selectAll,

                };
                return acc;
            }, {});
            return {
                ...prevState,
                ...updatedServices,
            };
        });
    };

    const generateCommands = async () => {
        setLoading(true)
        try {


            const formValues = await form.validateFields();

            const ip = dataIp.find((item) => item._id === formValues.ipaddress);

            const hasValidRecord = data.some(
                (record) => selectedServices[record.key]?.ims || selectedServices[record.key]?.net
            );

            if (!hasValidRecord) {
                message.warning("Phải có ít nhất 1 hàng thực thi");
                return;
            }

            const listconfig = data

                .map((record) => {
                    let commands = [];

                    if (selectedServices[record.key].net) {
                        commands.push("create_dvnet_list");
                    }

                    if (selectedServices[record.key].ims) {
                        commands.push("dv_ims_list");
                    }
                    return (
                        {
                            commands: commands,
                            slid: record.slid,
                            newcard: record.slot,
                            newport: record.port,
                            newonu: record.onuid,
                            vlanims: record.vlanims,
                            vlanmytv: record.vlanmytv,
                            vlannet: record.vlannet,

                        })
                });

            const dataObject = {
                devicetype: deviceType,
                ipaddress: ip.ipaddress,
                listconfig: listconfig,
            };


            const res = await ServiceGpon.ControlMany(dataObject);
            if (res) {
                setLoading(false)

                const newLine = (
                    <TerminalOutput key={lineData.length}>
                        {" "}
                        {res.detail.map((item) => item)}
                    </TerminalOutput>
                );
                setLineData((prevLineData) => prevLineData.concat(newLine));
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
            message.error("Lỗi");
        }
    };
    const handleDeleteDataTable = () => {
        setData([]);
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "key",
            key: "key",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Slot",
            dataIndex: "slot",
            key: "slot",
        },
        {
            title: "Port",
            dataIndex: "port",
            key: "port",
        },
        {
            title: "OnuID",
            dataIndex: "onuid",
            key: "onuid",
        },
        {
            title: "SLID",
            dataIndex: "slid",
            key: "slid",
        },
        {
            title: "Vlan Net",
            dataIndex: "vlannet",
            key: "vlannet",
        },
        {
            title: "Vlan MyTV",
            dataIndex: "vlanmytv",
            key: "vlanmytv",
        },
        {
            title: "Vlan Ims",
            dataIndex: "vlanims",
            key: "vlanims",
        },
        {
            title: "Chức năng",
            key: "action",
            render: (text, record) => (
                <Space>
                    <Checkbox
                        checked={selectedServices[record.key]?.ims || false}
                        onChange={() => handleServiceChange("ims", record)}
                    >
                        Tạo DV IMS
                    </Checkbox>
                    <Checkbox
                        checked={selectedServices[record.key]?.net || false}
                        onChange={() => handleServiceChange("net", record)}
                    >
                        Tạo DV Net
                    </Checkbox>
                </Space>
            ),
        },
    ]

    const formatNumber = (number) => {
        return number < 10 ? `0${number}` : `${number}`;
    };
    const onFinish = (values) => {
        setData([])



        const newSlot = values.card;
        const newPort = values.port;
        const startOnuID = values.start;
        const endOnuID = values.end;
        const vlanmytv = dataVlanMyTV.find(
            (item) => item._id === values.vlanmytv
        );
        const vlannet = dataVlanNet.find((item) => item._id === values.vlannet);
        const vlanims = dataVlanIMS.find((item) => item._id === values.vlanims);

        const newRows = [];
        console.log(vlannet);

        for (let onuID = startOnuID; onuID <= endOnuID; onuID++) {
            const SLID = `${formatNumber(newSlot)}${formatNumber(newPort)}0000${formatNumber(onuID)}`;

            newRows.push({
                key: data.length + newRows.length + 1,
                slot: newSlot,
                port: newPort,
                onuid: onuID,
                slid: SLID,
                vlanmytv: vlanmytv.number,
                vlanims: vlanims.number,
                vlannet: vlannet.number

            });
        }


        setData(newRows);


    };
    return (
        <div className="layout-content">
            <Row gutter={[24, 0]}>

                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                    <Card bordered={false} className="criclebox h-full" title="Thực hiện">
                        <Form
                            labelCol={{ span: 8 }}
                            // labelAlign="left"
                            initialValues={{ size: "small" }}
                            layout="horizontal"
                            size={"small"}
                            form={form}
                            className="form-card"
                            onFinish={onFinish}
                            style={{ marginTop: 10 }}
                        >
                            <Form.Item
                                label="Loại thiết bị"
                                className="select-item"
                                name="deviceType"
                                style={{ marginBottom: 10 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn loại thiết bị",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    onChange={(value) => setDeviceType(value)}
                                    placeholder="Chọn loại thiết bị"
                                >
                                    <Select.Option value="GPON ALU">GPON ALU</Select.Option>

                                    <Select.Option value="GPON MINI HW">
                                        GPON Mini HW
                                    </Select.Option>
                                    <Select.Option value="GPON MINI ZTE">
                                        GPON Mini ZTE
                                    </Select.Option>
                                    <Select.Option value="GPON ZTE">GPON ZTE</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Thiết bị"
                                className="select-item"
                                name="deviceName"
                                style={{ marginBottom: 10 }}
                                rules={[
                                    { required: true, message: "Vui lòng chọn thiết bị" },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Chọn thiết bị"
                                    onChange={(value) => setSelectDevices(value)}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    loading={loadingDevices}
                                >
                                    {devices.map((device) => (
                                        <Select.Option key={device._id} value={device._id}>
                                            {device.tenthietbi}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Ip"
                                name="ipaddress"
                                className="select-item"
                                style={{ marginBottom: 10 }}
                                rules={[{ required: true, message: "Vui lòng chọn Ip" }]}
                            >
                                <Select
                                    showSearch
                                    style={{ width: "100%" }}
                                    placeholder="Chọn Ip"
                                    loading={loadingIp}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    value={ipAddress}
                                    onChange={(value) => setIpAddress(value)}
                                >
                                    {dataIp?.map((item, i) => (
                                        <Select.Option key={i + 1} value={item._id}>
                                            {item.ipaddress}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Vlan Net"
                                name="vlannet"
                                className="select-item"
                                style={{ marginBottom: 10 }}
                                rules={[
                                    { required: true, message: "Vui lòng chọn Vlan Net" },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Chọn Vlan Net"
                                    loading={loadingVlanNet}
                                >
                                    {vlanNetOneDevice?.map((item, i) => (
                                        <Select.Option key={item._id} value={item._id}>
                                            {item.number}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Vlan Mytv"
                                name="vlanmytv"
                                className="select-item"
                                style={{ marginBottom: 10 }}
                                rules={[
                                    { required: true, message: "Vui lòng chọn Vlan Mytv" },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Chọn Vlan Mytv"
                                    loading={loadingVlanMyTV}
                                    disabled
                                >
                                    {dataVlanMyTV?.map((item, i) => (
                                        <Select.Option key={item._id} value={item._id}>
                                            {item.number}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Vlan IMS"
                                name="vlanims"
                                className="select-item"
                                loading={loadingVlanIMS}
                                style={{ marginBottom: 10 }}
                                rules={[
                                    { required: true, message: "Vui lòng chọn Vlan IMS" },
                                ]}
                            >
                                <Select style={{ width: "100%" }} placeholder="Chọn Vlan IMS" disabled>
                                    {dataVlanIMS?.map((item, i) => (
                                        <Select.Option key={item._id} value={item._id}>
                                            {item.number}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10 }} rules={[
                                { required: true, message: "Vui lòng nhập Card" },
                            ]} label="Card" name="card" className="select-item" >
                                <InputNumber style={{
                                    width: "100%",

                                }} placeholder="Nhập Card" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10 }} rules={[
                                { required: true, message: "Vui lòng nhập Port  " },
                            ]} label="Port" name="port" className="select-item">
                                <InputNumber style={{
                                    width: "100%",

                                }} placeholder="Nhập Port" width={100} />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10 }} label="Dãy Onu" name="onuuu" className="select-item">
                            </Form.Item>

                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}>
                                <Row gutter={16}>
                                    <Col>
                                        <Form.Item

                                            name="start"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập số bắt đầu',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        const end = getFieldValue('end');
                                                        if (value === undefined || end === undefined) {
                                                            return Promise.resolve();
                                                        }
                                                        if (value < end) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Số bắt đầu phải nhỏ hơn số kết thúc'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <InputNumber

                                                placeholder="Số bắt đầu"
                                                value={startValue}
                                                onChange={(value) => setStartValue(value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item
                                            name="end"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập số kết thúc',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        const start = getFieldValue('start');
                                                        if (value === undefined || start === undefined) {
                                                            return Promise.resolve();
                                                        }
                                                        if (value > start) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Số kết thúc phải lớn hơn số bắt đầu'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <InputNumber
                                                placeholder="Số kết thúc"
                                                value={endValue}
                                                onChange={(value) => setEndValue(value)}
                                            />
                                        </Form.Item>

                                    </Col>

                                </Row>
                            </div>


                            <Button
                                htmlType="submit"
                                type="primary"
                                style={{ borderColor: "#4CAF50", margin: "5px" }}
                            >
                                Tạo dữ liệu
                            </Button>

                        </Form>



                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                    <Card bordered={false} className="criclebox h-full" title="Chọn">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    style={{ margin: "5px" }}
                                    onClick={() => handleSelectAllFunctions(true)}
                                >
                                    {" "}
                                    Tạo tất cả DV
                                </Button>
                                <Button
                                    style={{ margin: "5px" }}
                                    onClick={() => handleSelectAllForService("ims")}
                                >
                                    {" "}
                                    Tạo DV IMS
                                </Button>
                                <Button
                                    style={{ margin: "5px" }}
                                    onClick={() => handleSelectAllForService("Net")}
                                >
                                    {" "}
                                    Tạo DV Net
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                    <Card bordered={false} className="criclebox h-full" title="Thực hiện">
                        <Button
                            style={{ margin: "5px" }}
                            type="primary"
                            onClick={generateCommands}
                            loading={loading}
                            disabled={data.length > 0 ? false : true}
                        >
                            Thực hiện
                        </Button>
                        <Button
                            style={{ margin: "5px" }}
                            type="primary"
                            onClick={handleDeleteDataTable}
                            disabled={data.length > 0 ? false : true}
                            danger
                        >
                            Xóa bỏ bảng dữ liệu
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={18} xl={24} className="mb-24">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Bảng dữ liệu" key="1">
                            <Table
                                columns={columns}
                                dataSource={data}
                                scroll={{ x: 1200 }}
                                pagination={{ pageSize: 6 }}
                            />
                        </TabPane>
                        <TabPane tab="Terminal" key="2">
                            <Card bordered={false} className="criclebox h-full">
                                <TerminalComponent lineData={lineData} />
                            </Card>
                        </TabPane>
                    </Tabs>

                </Col>

            </Row>

        </div>
    );
};

export default CreateList;
