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
    Upload,
} from "antd";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DownloadExcelButton from "../components/Button/DownloadExcelButton ";
import ServiceDevice from "../service/ServiceDevice";
import ServiceIp from "../service/ServiceIp";
import useAsync from "../hook/useAsync";
import ServiceGpon from "../service/ServiceGpon";
import { TerminalOutput } from "react-terminal-ui";
import TerminalComponent from "../components/Terminal/TerminalComponent";
import { useForm } from "antd/lib/form/Form";

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
    const { data: dataIp, loading: loadingIp } = useAsync(() =>
        ServiceIp.getAllIp()
    );
    const { data: dataDevice, loading: loadingDevice } = useAsync(() =>
        ServiceDevice.getAlldevice()
    );
    const handleServiceChange = (service, record) => {
        setSelectedServices((prevState) => ({
            ...prevState,
            [record.key]: {
                ...prevState[record.key],
                [service]: !prevState[record.key]?.[service],
            },
        }));
    };
    useEffect(() => {
        if (selectDevices) {
            const getADV = async () => {
                try {
                    const res = await ServiceDevice.getADevice(selectDevices);
                    setIpAddress(res.ipaddress);
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
    const columns = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "STT",
            render: (text, record, index) => index + 1,
        },

        {
            title: " Slot",
            dataIndex: "slot",
            key: "slot",
        },
        {
            title: " Port",
            dataIndex: "port",
            key: "port",
        },
        {
            title: " OnuID",
            dataIndex: "onuid",
            key: "onuid",
        },
        {
            title: "SLID",
            dataIndex: "slid",
            key: "slid",
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
    ];
    const generateCommands = async () => {
        try {
            if (deviceType == "") {
                message.warning("Chưa chọn loại thiết bị");
                return;
            }
            if (selectDevices == null) {
                message.warning("Chưa chọn thiết bị");
                return;
            }
            const device = dataDevice.find((item) => item._id === selectDevices);
            const ip = dataIp.find((item) => item._id === ipAddress);

            const hasValidRecord = data.some(
                (record) => selectedServices[record.key]?.sync
            );

            if (!hasValidRecord) {
                message.warning("Phải có ít nhất 1 hàng thực thi");
                return;
            }

            const listconfig = data
                .filter((record) => selectedServices[record.key]?.sync)
                .map((record) => ({
                    commands: "[change_sync_password_list]",
                    slid: record.slid,
                    newcard: record.newslot,
                    newport: record.newport,
                    newonu: record.newonuid,
                }));

            const dataObject = {
                devicetype: deviceType,
                selectDevices: device.tenthietbi,
                ipaddress: ip.ipaddress,
                listconfig: listconfig,
            };
            console.log(dataObject);

            const res = await ServiceGpon.ControlMany(dataObject);
            if (res) {
                const newLine = (
                    <TerminalOutput key={lineData.length}>
                        {" "}
                        {res.detail.map((item) => item)}
                    </TerminalOutput>
                );
                setLineData((prevLineData) => prevLineData.concat(newLine));
            }
        } catch (error) {
            console.log(error);
            message.error("Lỗi");
        }
    };

    const handleUpload = ({ file }) => {
        if (file.status !== "removed") {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const workbook = XLSX.read(arrayBuffer, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(worksheet);

                const excelColumns = Object.keys(json[0]).map((column) =>
                    column.toLowerCase()
                );

                const dataIndexes = columns
                    .filter((column) => column.dataIndex)
                    .map((column) => column.dataIndex.toLowerCase());

                const missingColumns = dataIndexes.filter(
                    (index) => !excelColumns.includes(index)
                );
                const extraColumns = excelColumns.filter(
                    (column) => !dataIndexes.includes(column)
                );

                if (missingColumns.length > 0 || extraColumns.length > 0) {
                    message.warning(
                        `Tên cột không khớp:\nThiếu: ${missingColumns.join(
                            ", "
                        )}\nThừa: ${extraColumns.join(", ")}`
                    );
                    return;
                }
                const columnHeaders = Object.keys(json[0]);
                const columnMapping = {};
                columnHeaders.forEach((header) => {
                    columnMapping[header.trim().toLowerCase()] = header;
                });

                console.log("Column Mapping:", columnMapping);

                // Cập nhật dữ liệu với tên cột mới
                const updatedJson = json.map((row) => {
                    const updatedRow = {};
                    Object.keys(row).forEach((header) => {
                        const lowercaseHeader = header.trim().toLowerCase();
                        if (columnMapping[lowercaseHeader]) {
                            updatedRow[lowercaseHeader] = row[header];
                        }
                    });
                    return updatedRow;
                });

                setData(
                    updatedJson.map((item, index) => ({ key: index + 1, ...item }))
                );
            };
            reader.readAsArrayBuffer(file);
        }
    };
    const handleDeleteDataTable = () => {
        setData([]);
    };
    const formatNumber = (number) => {
        return number < 10 ? `0${number}` : `${number}`;
    };


    const onFinish = (values) => {

        const newSlot = values.card;
        const newPort = values.port;
        const startOnuID = values.start;
        const endOnuID = values.end;

        const newRows = [];

        for (let onuID = startOnuID; onuID <= endOnuID; onuID++) {
            const SLID = `${formatNumber(newSlot)}${formatNumber(newPort)}0000${formatNumber(onuID)}`;

            newRows.push({
                key: data.length + newRows.length + 1, // Tạo key duy nhất cho mỗi dòng
                slot: newSlot,
                port: newPort,
                onuid: onuID,
                slid: SLID,
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
                            labelCol={{ span: 6 }}
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
                                    style={{ width: "100%", margin: 5 }}
                                    onChange={(value) => setDeviceType(value)}
                                    placeholder="Chọn loại thiết bị"
                                >
                                    <Select.Option value="GPON ALU">GPON ALU</Select.Option>
                                    <Select.Option value="GPON HW">GPON HW</Select.Option>
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
                                    style={{ width: "100%", margin: 5 }}
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
                                    style={{ width: "100%", margin: 5 }}
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

                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="Card" name="card" className="select-item" >
                                <InputNumber placeholder="Nhập Card" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="Port" name="port" className="select-item">
                                <InputNumber placeholder="Nhập Port" width={100} />
                            </Form.Item>
                            <label>Dãy Onu</label>
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
                                    Tạo DV ims
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


                <Col xs={24} sm={24} md={12} lg={18} xl={24} className="mb-24">
                    <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: 1200 }}
                        pagination={{ pageSize: 6 }}
                    />
                </Col>
            </Row>

        </div>
    );
};

export default CreateList;
