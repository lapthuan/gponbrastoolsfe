import { Button, Card, Checkbox, Col, message, Row, Space, Table, Upload } from "antd";

import { useState } from "react";
import * as XLSX from "xlsx";
import DownloadExcelButton from "../components/Button/DownloadExcelButton ";

const Port = () => {

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

    const handleSelectAllForService = (service) => {
        setSelectedServices(prevState => {
            const allSelected = data.every(record => prevState[record.key]?.[service]);
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
        setSelectedServices(prevState => {
            const updatedServices = data.reduce((acc, record) => {
                acc[record.key] = {
                    ...prevState[record.key],
                    delete: selectAll,
                    net: selectAll,
                    ims: selectAll,
                    mytv: selectAll,
                    sync: selectAll,
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
                        checked={selectedServices[record.key]?.delete || false}
                        onChange={() => handleServiceChange('delete', record)}
                    >
                        Xóa pass đồng bộ
                    </Checkbox>
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
                        Đổi pass đồng bộ
                    </Checkbox>
                </Space>
            ),
        },
    ];
    const generateCommands = () => {

        const commandsData = data.map(record => {
            const commands = [];

            if (selectedServices[record.key]?.delete) {
                commands.push('delete_port');
            }
            if (selectedServices[record.key]?.sync) {
                commands.push('change_sync_password');
            }
            if (selectedServices[record.key]?.net) {
                commands.push('create_dvnet');
            }
            if (selectedServices[record.key]?.ims) {
                commands.push('dv_ims');
            }
            if (selectedServices[record.key]?.mytv) {
                commands.push('create_dvmytv');
            }


            return {
                commands: `[${commands.join(', ')}]`,
                card: record.newslot,
                port: record.newport,
                onu: record.newonuid,
                slid: record.slid,
                vlanims: 1500,
                vlanmytv: 2400,
                vlannet: 500,
            };
        });

        console.log('Commands Data:', commandsData);


    };

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
    const handleDeleteDataTable = () => {
        setData([])
    }
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


                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24" >
                    <Card bordered={false} className="criclebox h-full " title="Excel">

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Space direction="vertical" align="center">
                                <Upload beforeUpload={() => false} onChange={handleUpload}>
                                    <Button style={{ borderColor: '#4CAF50', backgroundColor: '#4CAF50' }} type="primary">Upload File Excel</Button>
                                </Upload>
                                <DownloadExcelButton />
                            </Space>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                    <Card bordered={false} className="criclebox h-full" title="Chọn">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Button style={{ margin: '5px' }} onClick={() => handleSelectAllFunctions(true)}>Chọn tất cả</Button>
                                <Button style={{ margin: '5px' }} onClick={() => handleSelectAllFunctions(false)}>Bỏ chọn tất cả</Button>
                                <Button style={{ margin: '5px' }} onClick={() => handleSelectAllForService('delete')}> Xóa pass đồng bộ</Button>
                                <Button style={{ margin: '5px' }} onClick={() => handleSelectAllForService('net')}> Net</Button>
                                <Button style={{ margin: '5px' }} onClick={() => handleSelectAllForService('ims')}>IMS</Button>
                                <Button style={{ margin: '5px' }} onClick={() => handleSelectAllForService('mytv')}> MyTV</Button>
                                <Button style={{ margin: '5px' }} onClick={() => handleSelectAllForService('sync')}> Đổi pass đồng bộ</Button>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24" >
                    <Card bordered={false} className="criclebox h-full" title="Thực hiện"   >
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>

                                <Button style={{ margin: '5px' }} onClick={() => handleDeleteDataTable()} danger>Xóa dữ liệu bảng</Button>
                                <Button onClick={() => generateCommands()} type="primary" style={{ borderColor: '#4CAF50', margin: '5px' }}>Thực hiện</Button>
                            </div>
                        </div>

                    </Card>
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
