import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import ServiceDevice from "../service/ServiceDevice";
import useAsync from "../hook/useAsync";
import ServiceGpon from "../service/ServiceGpon";
import { TerminalOutput } from "react-terminal-ui";
import TerminalComponent from "../components/Terminal/TerminalComponent";
import { useForm } from "antd/lib/form/Form";
import ServiceDeviceType from "../service/ServiceDeviceType";
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
  const [startValue, setStartValue] = useState(null);
  const [endValue, setEndValue] = useState(null);
  const [ipAddress, setIpAddress] = useState();
  const [vlanNetOneDevice, setVlanNetOneDevice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vlanimsParam, setVlanImsParam] = useState(null);
  const [vlanMytvParam, setVlanMytvParam] = useState(null);
  const [deviceNames, setDeviceNames] = useState([]);
  const [deviceIps, setDeviceIps] = useState([]);
  const [deviceVlans, setDeviceVlans] = useState([]);

  const [selectedVlannet, setSelectedVlannet] = useState(null);
  const [selectedDeviceName, setSelectedDeviceName] = useState(null);

  //Load loại thiết bị
  const { data: dataDeviceType } = useAsync(() =>
    ServiceDeviceType.getAllDeviceType()
  );

  const handleServiceChange = (service, record) => {
    const newSelectedServices = { ...selectedServices };

    if (!newSelectedServices[record.key]) {
      newSelectedServices[record.key] = {};
    }

    newSelectedServices[record.key][service] =
      !newSelectedServices[record.key][service];

    setSelectedServices(newSelectedServices);
  };

  // 1. Khi chọn loại thiết bị → load danh sách tên
  useEffect(() => {
    if (!deviceType) return;

    form.resetFields([
      "deviceName",
      "ipaddress",
      "vlannet",
      "vlanims",
      "vlanmytv",
    ]);
    setDeviceNames([]);
    setIpAddress(null);
    setDeviceVlans([]);

    const fetchByType = async () => {
      try {
        const res = await ServiceDevice.getAllDeviceByType({
          loaithietbi: deviceType,
        });
        setDeviceNames(res);
      } catch {
        message.error("Không thể tải tên thiết bị theo loại");
      }
    };
    fetchByType();
  }, [deviceType]);

  // 2. Khi chọn tên thiết bị → load IP và VLANNet
  useEffect(() => {
    if (!selectedDeviceName) return;

    form.resetFields([
      "ipaddress",
      "vlannet",
      "vlanims",
      "vlanmytv",
      "port",
      "card",
      "onuId",
      "slId",
    ]);

    setIpAddress(null);
    setDeviceVlans([]);

    const fetchByName = async () => {
      try {
        const res = await ServiceDevice.getAllDeviceByName({
          name: selectedDeviceName,
        });
        const selectedDevice = res[0];
        const vlanims = res[0]?.vlanims;
        const vlanmytv = res[0]?.vlanmytv;

        setVlanImsParam(vlanims);
        setVlanMytvParam(vlanmytv);

        form.setFieldsValue({ vlanims, vlanmytv });
        setIpAddress(selectedDevice.ipaddress);
        setDeviceVlans(res);

        form.setFieldsValue({ ipaddress: selectedDevice.ipaddress });
      } catch {
        message.error("Không thể tải IP theo tên thiết bị");
      }
    };

    fetchByName();
  }, [selectedDeviceName]);

  // 3. Khi chọn VLANNet → load VLANIMS và VLANMyTV
  useEffect(() => {
    const selectedVlannet = form.getFieldValue("vlannet");
    if (!selectedVlannet) return;

    const fetchByVlannet = async () => {
      try {
        const res = await ServiceDevice.getAllDeviceByVlannet({
          vlannet: selectedVlannet,
        });
        const vlanims = res[0]?.vlanims;
        const vlanmytv = res[0]?.vlanmytv;

        setVlanImsParam(vlanims);
        setVlanMytvParam(vlanmytv);

        form.setFieldsValue({ vlanims, vlanmytv });
      } catch {
        message.error("Không thể tải VlanIMS và VlanMyTV theo VLANNet");
      }
    };

    fetchByVlannet();
  }, [form.getFieldValue("vlannet")]);

  const handleSelectAllForService = (service, selectAll = true) => {
    setSelectedServices((prevState) => {
      const updatedServices = data.reduce((acc, record) => {
        acc[record.key] = {
          ...prevState[record.key],
          [service]: selectAll,
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
    setLoading(true);
    try {
      const hasValidRecord = data.some(
        (record) =>
          selectedServices[record.key]?.ims || selectedServices[record.key]?.net
      );

      if (!hasValidRecord) {
        message.warning("Phải có ít nhất 1 hàng thực thi");
        setLoading(false);
        return;
      }

      const listconfig = data.map((record) => {
        let commands = [];

        if (selectedServices[record.key].net) {
          commands.push("create_dvnet_list");
        }

        if (selectedServices[record.key].ims) {
          commands.push("dv_ims_list");
        }
        return {
          commands: commands,
          slid: record.slid,
          newcard: record.slot,
          newport: record.port,
          newonu: record.onuid,
          vlanims: record.vlanims,
          vlanmytv: record.vlanmytv,
          vlannet: record.vlannet,
        };
      });

      const dataObject = {
        devicetype: deviceType,
        ipaddress: ipAddress,
        listconfig: listconfig,
      };

      const res = await ServiceGpon.ControlMany(dataObject);
      if (res) {
        setLoading(false);

        const newLine = (
          <TerminalOutput key={lineData.length}>
            {" "}
            {res.detail.map((item) => item)}
          </TerminalOutput>
        );
        setLineData((prevLineData) => prevLineData.concat(newLine));
      }
    } catch (error) {
      setLoading(false);

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
  ];

  const formatNumber = (number) => {
    return number < 10 ? `0${number}` : `${number}`;
  };

  const onFinish = (values) => {
    setData([]);

    const newSlot = values.card;
    const newPort = values.port;
    const startOnuID = values.start;
    const endOnuID = values.end;
    const vlanmytv = values.vlanmytv;
    const vlannet = values.vlannet;
    const vlanims = values.vlanims;

    const newRows = [];

    for (let onuID = startOnuID; onuID <= endOnuID; onuID++) {
      const SLID = `${formatNumber(newSlot)}${formatNumber(
        newPort
      )}0000${formatNumber(onuID)}`;

      newRows.push({
        key: data.length + newRows.length + 1,
        slot: newSlot,
        port: newPort,
        onuid: onuID,
        slid: SLID,
        vlanmytv: vlanmytv,
        vlanims: vlanims,
        vlannet: vlannet,
      });
    }

    setData(newRows);
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={10} xl={8} className="mb-24">
          <Card
            bordered={false}
            className="criclebox h-full"
            title="Thông tin cấu hình"
          >
            <Form
              // labelAlign="left"
              initialValues={{ size: "small" }}
              layout="vertical"
              size={"small"}
              form={form}
              className="form-card"
              onFinish={onFinish}
              style={{ marginTop: 10 }}
            >
              <Row gutter={16}>
                <Col span={11}>
                  <Form.Item
                    label="Loại thiết bị"
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
                      {dataDeviceType?.map((device) => (
                        <Select.Option key={device._id} value={device.typename}>
                          {device.typename}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Form.Item
                    label="Thiết bị"
                    name="deviceName"
                    style={{ marginBottom: 10, with: "100%" }}
                    rules={[
                      { required: true, message: "Vui lòng chọn thiết bị" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn thiết bị"
                      onChange={(value) => setSelectedDeviceName(value)}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {deviceNames.map((device) => (
                        <Select.Option
                          key={device._id}
                          value={device.tenthietbi}
                        >
                          {device.tenthietbi}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={11}>
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
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      value={ipAddress}
                      onChange={(value) => setIpAddress(value)}
                    >
                      {deviceIps?.map((item, i) => (
                        <Select.Option key={i + 1} value={item.ipaddress}>
                          {item.ipaddress}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={13}>
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
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Chọn Vlannet"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value) => setSelectedVlannet(value)}
                    >
                      {deviceVlans?.map((item, i) => (
                        <Select.Option key={item._id} value={item.vlannet}>
                          {item.vlannet}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={11}>
                  <Form.Item
                    label="Vlan MyTV"
                    name="vlanmytv"
                    style={{ marginBottom: 5 }}
                    rules={[
                      { required: true, message: "Vui lòng chọn Vlan MyTV" },
                    ]}
                  >
                    <Input style={{ width: "100%", height: "24px" }} disabled />
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Form.Item
                    label="Vlan IMS"
                    name="vlanims"
                    style={{ marginBottom: 5 }}
                    rules={[
                      { required: true, message: "Vui lòng chọn Vlan IMS" },
                    ]}
                  >
                    <Input style={{ width: "100%", height: "24px" }} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={11}>
                  <Form.Item
                    style={{ marginBottom: 10 }}
                    rules={[{ required: true, message: "Vui lòng nhập Card" }]}
                    label="Card"
                    name="card"
                    className="select-item"
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                      placeholder="Nhập Card"
                    />
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Form.Item
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "Vui lòng nhập Port  " },
                    ]}
                    label="Port"
                    name="port"
                    className="select-item"
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                      placeholder="Nhập Port"
                      width={100}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <hr />

              <Typography.Title level={5}>Nhập dãy số OnuID</Typography.Title>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="start"
                      label="Số bắt đầu"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số bắt đầu",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const end = getFieldValue("end");
                            if (value === undefined || end === undefined) {
                              return Promise.resolve();
                            }
                            if (value < end) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Số bắt đầu phải nhỏ hơn số kết thúc")
                            );
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        placeholder="Số bắt đầu"
                        value={startValue}
                        onChange={(value) => setStartValue(value)}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="end"
                      label="Số kết thúc"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số kết thúc",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const start = getFieldValue("start");
                            if (value === undefined || start === undefined) {
                              return Promise.resolve();
                            }
                            if (value > start) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Số kết thúc phải lớn hơn số bắt đầu")
                            );
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        placeholder="Số kết thúc"
                        value={endValue}
                        onChange={(value) => setEndValue(value)}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    span={8}
                    style={{ marginTop: "auto", marginBottom: "auto" }}
                  >
                    <Button
                      htmlType="submit"
                      type="primary"
                      style={{
                        borderColor: "#4CAF50",
                      }}
                    >
                      Tạo
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>

            <hr />
            <Typography.Title level={5}>Chức năng</Typography.Title>
            <Form.Item>
              <Checkbox.Group
                style={{ width: "100%" }}
                onChange={(checkedValues) => {
                  const allChecked = checkedValues.includes("all");
                  const imsChecked = checkedValues.includes("ims");
                  const netChecked = checkedValues.includes("net");

                  // Nếu chọn "Tạo tất cả DV"
                  if (allChecked) {
                    handleSelectAllFunctions(true);
                  } else {
                    // Nếu trước đó có check "Tạo tất cả DV" rồi bỏ -> tắt tất cả
                    if (!imsChecked && !netChecked) {
                      handleSelectAllFunctions(false);
                    } else {
                      // Đặt lại theo từng chức năng cụ thể
                      handleSelectAllForService("ims", imsChecked);
                      handleSelectAllForService("net", netChecked);
                    }
                  }
                }}
              >
                <Row justify="center" gutter={[8, 8]}>
                  <Col>
                    <Checkbox value="all">Tạo tất cả DV</Checkbox>
                  </Col>
                  <Col>
                    <Checkbox value="ims">Tạo DV IMS</Checkbox>
                  </Col>
                  <Col>
                    <Checkbox value="net">Tạo DV Net</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            {/* Gộp phần button Thực hiện */}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                style={{ margin: "5px" }}
                type="primary"
                onClick={generateCommands}
                loading={loading}
                disabled={data.length === 0}
              >
                Run
              </Button>
              <Button
                style={{ margin: "5px" }}
                type="primary"
                onClick={handleDeleteDataTable}
                danger
                disabled={data.length === 0}
              >
                Đặt lại
              </Button>
            </div>
          </Card>
        </Col>

        <Col Col xs={24} sm={24} md={12} lg={14} xl={16} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Bảng dữ liệu" key="1">
                <Table
                  columns={columns}
                  dataSource={data}
                  scroll={{ x: 1200 }}
                  pagination={{ pageSize: 8 }}
                />
              </TabPane>
              <TabPane tab="Terminal" key="2">
                <Card bordered={false} className="criclebox h-full">
                  <TerminalComponent lineData={lineData} />
                </Card>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateList;
