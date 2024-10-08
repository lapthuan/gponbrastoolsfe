import {
  Button,
  Card,
  Checkbox,
  Col,
  message,
  Row,
  Select,
  Space,
  Table,
  Tabs,
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
const { TabPane } = Tabs;

const Port = () => {
  const [lineData, setLineData] = useState([
    <TerminalOutput key={"12312312312321312"}>
      {"typ:isadmin>#"}
    </TerminalOutput>,
  ]);
  const [data, setData] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [deviceType, setDeviceType] = useState("");
  const [devices, setDevices] = useState([]);
  const [onLoading, setOnLoading] = useState(false);
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
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (text, record, index) => index + 1,
    },
    {
      title: "UserNet",
      dataIndex: "usernet",
      key: "usernet",
    },
    {
      title: "Old Slot",
      dataIndex: "oldslot",
      key: "oldslot",
    },
    {
      title: "Old Port",
      dataIndex: "oldport",
      key: "oldport",
    },
    {
      title: "Old OnuID",
      dataIndex: "oldonuid",
      key: "oldonuid",
    },
    {
      title: "SLID",
      dataIndex: "slid",
      key: "slid",
    },
    {
      title: "New Slot",
      dataIndex: "newslot",
      key: "newslot",
    },
    {
      title: "New Port",
      dataIndex: "newport",
      key: "newport",
    },
    {
      title: "New OnuID",
      dataIndex: "newonuid",
      key: "newonuid",
    },
    {
      title: "Chức năng",
      key: "action",
      render: (text, record) => (
        <Space>
          <Checkbox
            checked={selectedServices[record.key]?.sync || false}
            onChange={() => handleServiceChange("sync", record)}
          >
            Đổi pass đồng bộ
          </Checkbox>
        </Space>
      ),
    },
  ];
  const generateCommands = async () => {
    try {
      setOnLoading(true);
      if (deviceType == "") {
        message.warning("Chưa chọn loại thiết bị");
        setOnLoading(false);
        return;
      }
      if (selectDevices == null) {
        message.warning("Chưa chọn thiết bị");
        setOnLoading(false);
        return;
      }
      const device = dataDevice.find((item) => item._id === selectDevices);
      const ip = dataIp.find((item) => item._id === ipAddress);

      const hasValidRecord = data.some(
        (record) => selectedServices[record.key]?.sync
      );

      if (!hasValidRecord) {
        message.warning("Phải có ít nhất 1 hàng thực thi");
        setOnLoading(false);
        return;
      }

      const listconfig = data
        .filter((record) => selectedServices[record.key]?.sync)
        .map((record) => ({
          commands: ["change_sync_password_list"],
          slid: record.slid,
          newcard: record.newslot,
          newport: record.newport,
          newonu: record.newonuid,
          vlanims: 0,
          vlannet: 0,
          vlanmytv: 0,
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
        setOnLoading(false);
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
    setLineData([<TerminalOutput>{"typ:isadmin>#"}</TerminalOutput>]);
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
        <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
          <Card bordered={false} className="criclebox h-full " title="Excel">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Space direction="vertical" align="center">
                <Upload beforeUpload={() => false} onChange={handleUpload}>
                  <Button
                    style={{
                      borderColor: "#4CAF50",
                      backgroundColor: "#4CAF50",
                    }}
                    type="primary"
                  >
                    Upload File Excel
                  </Button>
                </Upload>
                <DownloadExcelButton />
              </Space>
            </div>
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
                  onClick={() => handleSelectAllForService("sync")}
                >
                  {" "}
                  Đổi pass đồng bộ
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
          <Card bordered={false} className="criclebox h-full" title="Thực hiện">
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

                <Button
                  onClick={() => generateCommands()}
                  type="primary"
                  loading={onLoading}
                  style={{ borderColor: "#4CAF50", margin: "5px" }}
                >
                  {onLoading ? "Loading" : "Run"}
                </Button>
                <Button
                  style={{ margin: "5px" }}
                  onClick={() => handleDeleteDataTable()}
                  danger
                >
                  Clear
                </Button>
              </div>
            </div>
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

export default Port;
