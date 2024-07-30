import { Button, Card, Checkbox, Col, Form, Input, InputNumber, message, Row, Space, Table, Upload } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import * as XLSX from "xlsx";

const Port = () => {
    const [form] = useForm();
    const [data, setData] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});

    const handleServiceChange = (service, record) => {
        setSelectedServices(prevState => ({
            ...prevState,
            [record.key]: {
                ...prevState[record.key],
                [service]: !prevState[record.key]?.[service],
            }
        }));
    };

    const handleSelectAllForService = async (service) => {
        await setSelectedServices(prevState => {
            const allSelected = Object.values(prevState).every(record => record?.[service]);
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
    const columns = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'UserNet',
            dataIndex: 'usernet',
            key: 'usernet',
        },
        {
            title: 'Old Slot',
            dataIndex: 'oldslot',
            key: 'oldslot',
        },
        {
            title: 'Old Port',
            dataIndex: 'oldport',
            key: 'oldport',
        },
        {
            title: 'Old OnuID',
            dataIndex: 'oldonuid',
            key: 'oldonuid',
        },
        {
            title: 'SLID',
            dataIndex: 'slid',
            key: 'slid',
        },
        {
            title: 'New Slot',
            dataIndex: 'newslot',
            key: 'newslot',
        },
        {
            title: 'New Port',
            dataIndex: 'newport',
            key: 'newport',
        },
        {
            title: 'New OnuID',
            dataIndex: 'newonuid',
            key: 'newonuid',
        },
        {
            title: "Chức năng",
            key: "action",
            render: (text, record) => (
                <Space>
                    <Checkbox
                        checked={selectedServices[record.key]?.net || false}
                        onChange={() => handleServiceChange('net', record)}
                    >
                        Tạo DV Net
                    </Checkbox>
                    <Checkbox
                        checked={selectedServices[record.key]?.ims || false}
                        onChange={() => handleServiceChange('ims', record)}
                    >
                        Tạo DV IMS
                    </Checkbox>
                    <Checkbox
                        checked={selectedServices[record.key]?.mytv || false}
                        onChange={() => handleServiceChange('mytv', record)}
                    >
                        Tạo DV MyTV
                    </Checkbox>
                    <Checkbox
                        checked={selectedServices[record.key]?.sync || false}
                        onChange={() => handleServiceChange('sync', record)}
                    >
                        Xóa pass đồng bộ
                    </Checkbox>
                </Space>
            ),
        },
    ];

    const handleUpload = ({ file }) => {
        if (file.status !== "removed") {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(worksheet);

                const excelColumns = Object.keys(json[0]).map(column => column.toLowerCase());


                const dataIndexes = columns
                    .filter(column => column.dataIndex)
                    .map(column => column.dataIndex.toLowerCase());



                const missingColumns = dataIndexes.filter(index => !excelColumns.includes(index));
                const extraColumns = excelColumns.filter(column => !dataIndexes.includes(column));

                if (missingColumns.length > 0 || extraColumns.length > 0) {
                    message.warning(`Tên cột không khớp:\nThiếu: ${missingColumns.join(', ')}\nThừa: ${extraColumns.join(', ')}`);
                    return;
                }
                const columnHeaders = Object.keys(json[0]);
                const columnMapping = {};
                columnHeaders.forEach(header => {
                    columnMapping[header.trim().toLowerCase()] = header;
                });

                console.log('Column Mapping:', columnMapping);

                // Cập nhật dữ liệu với tên cột mới
                const updatedJson = json.map(row => {
                    const updatedRow = {};
                    Object.keys(row).forEach(header => {
                        const lowercaseHeader = header.trim().toLowerCase();
                        if (columnMapping[lowercaseHeader]) {
                            updatedRow[lowercaseHeader] = row[header];
                        }
                    });
                    return updatedRow;
                });

                setData(updatedJson.map((item, index) => ({ key: index + 1, ...item })));
            };
            reader.readAsArrayBuffer(file);
        }
    };
    // const formatNumber = (number) => {
    //     return number < 10 ? `0${number}` : `${number}`;
    // };

    // const handleAdd = () => {
    //     form.validateFields().then(values => {
    //         const { newSlot, newPort, newOnuID } = values;
    //         const SLID = `${formatNumber(newSlot)}${formatNumber(newPort)}0000${formatNumber(newOnuID)}`;
    //         const newData = {
    //             key: data.length + 1,
    //             ...values,
    //             SLID,
    //         };
    //         setData(prevData => [...prevData, newData]);

    //     });
    // };
    return (
        <div className="layout-content">
            <Row gutter={[24, 0]}>

                {/* <Col xs={24} sm={24} md={12} lg={18} xl={8} className="mb-24">
                    <Card>
                        <Form
                            form={form}
                            initialValues={{ size: "small" }}
                            layout="vertical"
                            size={"small"}
                            className="form-card"
                            style={{ marginTop: 10 }}
                        >
                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="UserNet" name="userNet" className="select-item" >
                                <Input placeholder="Nhập User Net" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="Old Slot" name="oldSlot" className="select-item" >
                                <InputNumber placeholder="Nhập Old Slot" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="Old Port" name="oldPort" className="select-item" >
                                <InputNumber placeholder="Nhập Old Port" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="Old OnuID" name="oldOnuID" className="select-item" >
                                <InputNumber placeholder="Nhập Old OnuID" />
                            </Form.Item>


                        </Form>

                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={18} xl={8} className="mb-24">
                    <Card>
                        <Form
                            form={form}
                            initialValues={{ size: "small" }}
                            layout="vertical"
                            size={"small"}
                            className="form-card"
                            style={{ marginTop: 10 }}
                        >

                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="New Slot" name="newSlot" className="select-item" >
                                <InputNumber placeholder="Nhập New Slot" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="New Port" name="newPort" className="select-item" >
                                <InputNumber placeholder="Nhập New Port" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10, width: "100%" }} label="New OnuID" name="newOnuID" className="select-item" >
                                <InputNumber placeholder="Nhập New OnuID" />
                            </Form.Item>

                        </Form>
                        <Space direction="horizontal">
                            <Button type="primary" onClick={handleAdd}>Thêm</Button>
                            <Button type="primary" onClick={handleAdd} danger>Reset Form</Button>
                        </Space>

                    </Card>
                </Col> */}
                <Col xs={24} sm={24} md={12} lg={6} xl={24} className="mb-24">
                    <Space direction="horizontal">
                        <Upload beforeUpload={() => false} onChange={handleUpload}>
                            <Button type="primary">Upload File Excel</Button>
                        </Upload>
                        <Button onClick={() => handleSelectAllForService('net')}>Chọn tất cả Net</Button>
                        <Button onClick={() => handleSelectAllForService('ims')}>Chọn tất cả IMS</Button>
                        <Button onClick={() => handleSelectAllForService('mytv')}>Chọn tất cả MyTV</Button>
                        <Button onClick={() => handleSelectAllForService('sync')}>Chọn tất cả Xóa pass đồng bộ</Button>
                        <Button onClick={() => handleSelectAllForService('sync')} danger>Xóa dữ liệu bảng</Button>

                    </Space>
                </Col>
                <Col xs={24} sm={24} md={12} lg={18} xl={24} className="mb-24">

                    <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: 1600 }}
                        pagination={{ pageSize: 6 }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Port;
