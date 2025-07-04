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
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DownloadExcelButton from "../components/Button/DownloadExcelButton ";
import ServiceDevice from "../service/ServiceDevice";
import useAsync from "../hook/useAsync";
import ServiceGpon from "../service/ServiceGpon";
import { TerminalOutput } from "react-terminal-ui";
import TerminalComponent from "../components/Terminal/TerminalComponent";
import ServiceDeviceType from "../service/ServiceDeviceType";

const { TabPane } = Tabs;
const { Title } = Typography;

const Port = () => {
  const [lineData, setLineData] = useState([
    <TerminalOutput key={"12312312312321312"}>
      {"typ:isadmin>#"}
    </TerminalOutput>,
  ]);
  const [data, setData] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [deviceType, setDeviceType] = useState("");
  const [onLoading, setOnLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState();
  const [deviceNames, setDeviceNames] = useState([]); // danh sách tên thiết bị theo loại
  const [selectedDeviceName, setSelectedDeviceName] = useState(); // tên thiết bị đã chọn
  const [deviceIps, setDeviceIps] = useState([]); // danh sách IP lấy được từ thiết bị

  //Load loại thiết bị
  const { data: dataDeviceType } = useAsync(() =>
    ServiceDeviceType.getAllDeviceType()
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
    if (!deviceType) return;
    setDeviceNames([]);
    setSelectedDeviceName(undefined);
    setIpAddress(undefined);

    const fetchByType = async () => {
      try {
        const res = await ServiceDevice.getAllDeviceByType({
          loaithietbi: deviceType,
        });
        setDeviceNames(res); // Lưu danh sách thiết bị theo loại
      } catch {
        message.error("Không thể tải tên thiết bị theo loại");
      }
    };

    fetchByType();
  }, [deviceType]);

  useEffect(() => {
    if (!selectedDeviceName) return;

    const fetchByName = async () => {
      try {
        const res = await ServiceDevice.getAllDeviceByName({
          name: selectedDeviceName,
        });
        const firstDevice = res[0];
        if (firstDevice) {
          setDeviceIps([firstDevice]); // bạn có thể dùng mảng hoặc 1 IP tùy
          setIpAddress(firstDevice.ipaddress); // auto set IP lên giao diện
        }
      } catch {
        message.error("Không thể tải IP theo tên thiết bị");
      }
    };

    fetchByName();
  }, [selectedDeviceName]);

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

  // const handleSelectAllFunctions = (selectAll) => {
  //   setSelectedServices((prevState) => {
  //     const updatedServices = data.reduce((acc, record) => {
  //       acc[record.key] = {
  //         ...prevState[record.key],
  //         delete: selectAll,
  //         net: selectAll,
  //         ims: selectAll,
  //         mytv: selectAll,
  //         sync: selectAll,
  //       };
  //       return acc;
  //     }, {});
  //     return {
  //       ...prevState,
  //       ...updatedServices,
  //     };
  //   });
  // };

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
      if (deviceNames == null) {
        message.warning("Chưa chọn thiết bị");
        setOnLoading(false);
        return;
      }

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
        selectDevices: deviceNames,
        ipaddress: deviceIps,
        listconfig: listconfig,
      };

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
    <div className="layout-content" style={{ padding: "20px" }}>
      <Row gutter={[24, 24]}>
        {/* Card Excel */}
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            title="Excel"
            style={{
              height: "100%",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              padding: "20px",
            }}
          >
            <Space
              direction="horizontal"
              style={{ width: "100%" }}
              align="center"
            >
              <Upload beforeUpload={() => false} onChange={handleUpload}>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#4CAF50",
                    borderColor: "#4CAF50",
                  }}
                >
                  Upload File Excel
                </Button>
              </Upload>
              <DownloadExcelButton />
            </Space>

            <Space
              direction="vertical"
              style={{ marginTop: 16, width: "100%" }}
            >
              <Title level={5}>Thiết bị: </Title>
              <Select
                style={{ width: "100%", marginBottom: 10 }}
                onChange={(value) => setDeviceType(value)}
                placeholder="Chọn loại thiết bị"
              >
                {dataDeviceType?.map((device) => (
                  <Select.Option key={device._id} value={device.typename}>
                    {device.typename}
                  </Select.Option>
                ))}
              </Select>

              <Select
                style={{ width: "100%", marginBottom: 10 }}
                placeholder="Chọn thiết bị"
                onChange={(value) => setSelectedDeviceName(value)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {deviceNames.map((device, i) => (
                  <Select.Option key={i} value={device.tenthietbi}>
                    {device.tenthietbi}
                  </Select.Option>
                ))}
              </Select>

              <Select
                style={{ width: "100%", marginBottom: 10 }}
                placeholder="Chọn IP"
                value={ipAddress}
                disabled
              >
                {deviceIps.map((device, i) => (
                  <Select.Option key={i} value={device.ipaddress}>
                    {device.ipaddress}
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Space>
              <div style={{ textAlign: "center" }}>
                <Button
                  style={{ margin: "5px" }}
                  onClick={() => handleSelectAllForService("sync")}
                >
                  Đổi pass đồng bộ
                </Button>
              </div>
              <Button
                type="primary"
                onClick={generateCommands}
                loading={onLoading}
                style={{ backgroundColor: "#1890ff", borderColor: "#4CAF50" }}
              >
                {onLoading ? "Loading" : "Run"}
              </Button>
              <Button danger onClick={handleDeleteDataTable}>
                Clear
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Card Table + Terminal */}
        <Col xs={24} md={16}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              height: "100%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Tabs
              defaultActiveKey="1"
              style={{ height: "100%", overflowY: "auto" }}
            >
              <Tabs.TabPane tab="Bảng dữ liệu" key="1">
                <Table
                  columns={columns}
                  dataSource={data}
                  scroll={{ x: 1200 }}
                  pagination={{ pageSize: 6 }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Terminal" key="2">
                <Card bordered={false} style={{ background: "#f9f9f9" }}>
                  <TerminalComponent lineData={lineData} />
                </Card>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Port;
