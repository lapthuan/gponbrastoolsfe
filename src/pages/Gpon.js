import { useEffect, useRef, useState } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
  Button,
  Radio,
  Select,
  Form,
  InputNumber,
  Space,
  message,
  Switch,
  Input,
} from "antd";

import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import useAsync from "../hook/useAsync";
import ServiceIp from "../service/ServiceIp";
import ServiceVlanIMS from "../service/ServiceVlanIMS";
import ServiceVlanMyTV from "../service/ServiceVlanMyTV";
import ServiceVlanNet from "../service/ServiceVlanNet";
import ServiceDevice from "../service/ServiceDevice";
import ServiceGpon from "../service/ServiceGpon";
import { useForm } from "antd/es/form/Form";
import { UserOutlined } from "@ant-design/icons";
import ServiceUser from "../service/ServiceUser";

function Gpon() {
  const { Title } = Typography;
  const [lineData, setLineData] = useState([
    <TerminalOutput>{"typ:isadmin>#"}</TerminalOutput>,
  ]);
  const [runLoading, setRunLoading] = useState(false);
  const [deviceType, setDeviceType] = useState("");
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [selectDevices, setSelectDevices] = useState();
  const [radioValue, setRadioValue] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [userName, setUserName] = useState(false);
  const [loadingUserName, setLoadingUserName] = useState(false);
  const terminalRef = useRef(null);
  const { data: dataDevice, loading: loadingDevice } = useAsync(() =>
    ServiceDevice.getAlldevice()
  );
  const { data: dataIp, loading: loadingIp } = useAsync(() =>
    ServiceIp.getAllIp()
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
  const [form] = useForm();
  const [form2] = useForm();
  useEffect(() => {
    // Cuộn xuống cuối khi lineData thay đổi
    if (terminalRef.current) {
      const terminalElement = terminalRef.current;
      terminalElement.scrollTop = terminalElement.scrollHeight;
    }
  }, [lineData]);
  const controlGpon = async (mytv, net, ims, ip, loaithietbi, form2Values) => {
    try {
      const data = {
        ipaddress: ip,
        commands: radioValue,
        device_types: loaithietbi,
        card: form2Values.card ? form2Values.card : 0,
        port: form2Values.port ? form2Values.port : 0,
        onu: form2Values.onuId ? form2Values.onuId : 0,
        slid: form2Values.slId ? form2Values.slId : 0,
        vlanims: ims,
        vlanmytv: mytv,
        vlannet: net,

      };

      const res = await ServiceGpon.ControlGpon(data);

      const newLine = (
        <TerminalOutput key={lineData.length}>
          {" "}
          {res.detail.map((item) => item)}
        </TerminalOutput>
      );
      setLineData((prevLineData) => prevLineData.concat(newLine));
    } catch (error) {
      console.error("Error controlling GPON:", error);
      // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo cho người dùng
    } finally {
      setRunLoading(false);
    }
  };
  const controlGponHW = async (mytv, net, ims, ip, loaithietbi, form2Values) => {
    try {
      const data = {
        ipaddress: ip,
        commands: radioValue,
        device_types: loaithietbi,
        card: form2Values.card ? form2Values.card : 0,
        port: form2Values.port ? form2Values.port : 0,
        onu: form2Values.onuId ? form2Values.onuId : 0,
        slid: form2Values.slId ? form2Values.slId : 0,
        vlanims: ims,
        vlanmytv: mytv,
        vlannet: net,
        service_portnet: form2Values.portvlannet ? form2Values.portvlannet : 0,
        service_portgnms: form2Values.portgnms ? form2Values.portgnms : 0,
        service_portims: form2Values.portims ? form2Values.portims : 0,
      };

      const res = await ServiceGpon.ControlGpon(data);

      const newLine = (
        <TerminalOutput key={lineData.length}>
          {" "}
          {res.detail.map((item) => item)}
        </TerminalOutput>
      );
      setLineData((prevLineData) => prevLineData.concat(newLine));
    } catch (error) {
      console.error("Error controlling GPON:", error);
      // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo cho người dùng
    } finally {
      setRunLoading(false);
    }
  };
  const handleRun = async () => {
    try {
      const formValues = await form.validateFields();
      const form2Values = await form2.validateFields();
      if (radioValue === null) {
        message.error("Vui lòng chọn một chức năng.");
        return;
      }
      console.log(form2Values);
      if (radioValue !== "sync_password") {
        if (
          form2Values.card === undefined ||
          form2Values.port === undefined ||
          form2Values.onuId === undefined
        ) {
          message.warning("Nhập thiếu thông tin");
          return;
        }
      }
      if (radioValue === "create_dvnet") {
        if (form2Values.slId === undefined) {
          message.warning("Nhập thiếu SLID");
          return;
        }
        if (form2Values.portvlannet === undefined) {
          message.warning("Nhập thiếu Port Vlan Net");
          return;
        }
        if (form2Values.portgnms === undefined) {
          message.warning("Nhập thiếu Port GNMS");
          return;
        }
        if (
          form2Values.slId.toString().length < 6 ||
          form2Values.slId.toString().length > 10
        ) {
          message.warning("SLID phải bao gồm 6 đến 10 ký tự");
          return;
        }
      }
      if (radioValue === "dv_ims") {
        if (form2Values.portims === undefined) {
          message.warning("Nhập thiếu Port IMS");
          return;
        }
      }
      if (radioValue === "change_sync_password") {
        if (form2Values.slId === undefined) {
          message.warning("Nhập thiếu SLid");
          return;
        }
        if (
          form2Values.slId.toString().length < 6 ||
          form2Values.slId.toString().length > 10
        ) {
          message.warning("SLID phải bao gồm 6 đến 10 ký tự");
          return;
        }
      }
      setRunLoading(true);
      const newLine = <TerminalOutput>{"typ:isadmin># ..."}</TerminalOutput>;
      setLineData((prevLineData) => prevLineData.concat(newLine));
      const device = devices.find((item) => item._id === formValues.deviceName);
      if (device == undefined) {
        const ip = dataIp.find((item) => item._id === formValues.ipaddress);
        const mytv = dataVlanMyTV.find(
          (item) => item._id === formValues.vlanmytv
        );
        const net = dataVlanNet.find((item) => item._id === formValues.vlannet);
        const ims = dataVlanIMS.find((item) => item._id === formValues.vlanims);

        controlGpon(
          mytv.number,
          net.number,
          ims.number,
          ip.ipaddress,
          formValues.deviceType,
          form2Values
        );
        return;
      }
      const ip = dataIp.find((item) => item._id === formValues.ipaddress);
      const mytv = dataVlanMyTV.find(
        (item) => item._id === formValues.vlanmytv
      );
      const net = dataVlanNet.find((item) => item._id === formValues.vlannet);
      const ims = dataVlanIMS.find((item) => item._id === formValues.vlanims);
      if (deviceType === "GPON HW") {
        controlGponHW(
          mytv.number,
          net.number,
          ims.number,
          ip.ipaddress,
          device.loaithietbi,
          form2Values
        );
      } else {
        controlGpon(
          mytv.number,
          net.number,
          ims.number,
          ip.ipaddress,
          device.loaithietbi,
          form2Values
        );
      }

      // Process the collected data as needed
    } catch (error) {
      console.error("Validation failed:", error);
      setRunLoading(false);
      message.error("Vui lòng điền đầy đủ thông tin.");
    }
  };

  useEffect(() => {
    if (deviceType) {
      setLoadingDevices(true);
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

  //Load dữ liệu cho các input còn lại
  useEffect(() => {
    if (selectDevices) {
      const getADV = async () => {
        try {
          const res = await ServiceDevice.getADevice(selectDevices);
          form.setFieldsValue({
            ipaddress: res.ipaddress,
            vlanims: res.vlanims,
            vlanmytv: res.vlanmytv,
            vlannet: res.vlannet,
          });
        } catch (error) {
          console.error("Error fetching device data:", error);
        }
      };

      getADV();
    }
  }, [selectDevices, form]);

  const handleClear = () => {
    setLineData([<TerminalOutput>{"typ:isadmin>#"}</TerminalOutput>]);
  };
  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    form.resetFields();

    form2.resetFields();
  };

  const handleGetUser = async () => {
    setLoadingUserName(true)
    try {
      const rs = await ServiceUser.getUser({ username: userName });
      const idDevice = dataDevice.find(
        (device) => device.tenthietbi == rs.detail.data[0].SystemName
      );

      const res = await ServiceDevice.getADevice(idDevice._id);

      form.setFieldsValue({
        deviceType: res.loaithietbi,
        deviceName: res.tenthietbi,
        ipaddress: res.ipaddress,
        vlanims: res.vlanims,
        vlanmytv: res.vlanmytv,
        vlannet: res.vlannet,
      });

      form2.setFieldsValue({
        port: rs.detail.data[0].PortNo,
        card: rs.detail.data[0].SlotNo,
        onuId: rs.detail.data[0].OnuIndex,
      });
      setDeviceType(res.loaithietbi)
      setLoadingUserName(false)
    } catch (error) {
      message.warning("Không tìm thấy người dùng")
      setLoadingUserName(false)

    }




  };
  return (
    <>
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div>
                <Space direction="horizontal">
                  <Title level={5}>Thông số</Title>
                  <Switch
                    checked={isChecked}
                    onChange={handleSwitchChange}
                    checkedChildren="Tài khoản"
                    unCheckedChildren="Thiết bị"
                  />
                </Space>
              </div>
              {isChecked === false ? (
                <Form
                  form={form}
                  labelCol={{ span: 8 }}
                  initialValues={{
                    size: "small",
                  }}
                  layout="horizontal"
                  size={"small"}
                  className="form-card"
                  style={{ marginTop: 40 }}
                >
                  <Form.Item
                    label="Loại thiết bị"
                    className="select-item"
                    name="deviceType"
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
                      <Select.Option value="GPON HW">GPON HW</Select.Option>
                      <Select.Option value="GPON MINI HW">GPON Mini HW</Select.Option>
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
                    rules={[
                      { required: true, message: "Vui lòng chọn thiết bị" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn thiết bị"
                      onChange={(value) => setSelectDevices(value)}
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
                    rules={[{ required: true, message: "Vui lòng chọn Ip" }]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn Ip"
                      loading={loadingIp}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {dataIp?.map((item, i) => (
                        <Select.Option key={item._id} value={item._id}>
                          {item.ipaddress}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Vlan Net"
                    name="vlannet"
                    className="select-item"
                    rules={[
                      { required: true, message: "Vui lòng chọn Vlan Net" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn Vlan Net"
                      loading={loadingVlanNet}
                    >
                      {dataVlanNet?.map((item, i) => (
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
                    rules={[
                      { required: true, message: "Vui lòng chọn Vlan Mytv" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Chọn Vlan Mytv"
                      loading={loadingVlanMyTV}
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
                    rules={[
                      { required: true, message: "Vui lòng chọn Vlan IMS" },
                    ]}
                  >
                    <Select placeholder="Chọn Vlan IMS">
                      {dataVlanIMS?.map((item, i) => (
                        <Select.Option key={item._id} value={item._id}>
                          {item.number}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              ) : (
                <>
                  <Space direction="horizontal">
                    <Input
                      placeholder="Tài khoản"
                      onChange={(value) => setUserName(value.target.value)}
                      prefix={<UserOutlined />}
                    />
                    <Button onClick={handleGetUser} loading={loadingUserName}>Tìm dữ liệu</Button>
                  </Space>
                  <Form
                    form={form}
                    labelCol={{ span: 8 }}
                    initialValues={{
                      size: "small",
                    }}
                    layout="horizontal"
                    size={"small"}
                    className="form-card"
                    style={{ marginTop: 40 }}
                  >
                    <Form.Item
                      label="Loại thiết bị"
                      className="select-item"
                      name="deviceType"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn loại thiết bị",
                        },
                      ]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn loại thiết bị"
                        onChange={(value) => setDeviceType(value)}
                      >
                        <Select.Option value="GPON ALU">GPON ALU</Select.Option>
                        <Select.Option value="GPON HW">GPON HW</Select.Option>
                        <Select.Option value="GPON MINI HW">GPON Mini HW</Select.Option>
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
                      rules={[
                        { required: true, message: "Vui lòng chọn thiết bị" },
                      ]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn thiết bị"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        loading={loadingDevice}
                      >
                        {dataDevice.map((device) => (
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
                      rules={[{ required: true, message: "Vui lòng chọn Ip" }]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn Ip"
                        loading={loadingIp}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {dataIp?.map((item, i) => (
                          <Select.Option key={item._id} value={item._id}>
                            {item.ipaddress}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Vlan Net"
                      name="vlannet"
                      className="select-item"
                      rules={[
                        { required: true, message: "Vui lòng chọn Vlan Net" },
                      ]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn Vlan Net"
                        loading={loadingVlanNet}
                      >
                        {dataVlanNet?.map((item, i) => (
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
                      rules={[
                        { required: true, message: "Vui lòng chọn Vlan Mytv" },
                      ]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn Vlan Mytv"
                        loading={loadingVlanMyTV}
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
                      rules={[
                        { required: true, message: "Vui lòng chọn Vlan IMS" },
                      ]}
                    >
                      <Select placeholder="Chọn Vlan IMS">
                        {dataVlanIMS?.map((item, i) => (
                          <Select.Option key={item._id} value={item._id}>
                            {item.number}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
            <Card
              bordered={false}
              className="criclebox h-full"
              ref={terminalRef}
            >
              <Terminal
                style={{ maxWidth: "150px" }}
                height="45vh"
                colorMode={ColorMode.Dark}
                ref={terminalRef}
              >
                {lineData}
              </Terminal>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full ">
              <div className="ml-16">
                <Title level={5}>Thông số</Title>
              </div>

              <Radio.Group
                className="ml-16"
                onChange={(e) => setRadioValue(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value={"sync_password"}>Xem Password đồng bộ</Radio>
                  <Radio value={"change_sync_password"}>Đổi Password đồng bộ</Radio>
                  <Radio value={"delete_port"}>Xóa Port</Radio>
                  <Radio value={"check_mac"}>Xem Mac</Radio>
                  <Radio value={"create_dvnet"}>Tạo DV_NET</Radio>
                  <Radio value={"dv_mytv"}>Tạo DV_MYTV</Radio>
                  <Radio value={"dv_ims"}>Tạo DV_IMS</Radio>
                  <Radio value={"check_capacity"}>Kiểm tra công suất</Radio>
                  {deviceType === "GPON ALU" && <Radio value={"status_port"}>
                    Xem trạng thái port
                  </Radio>}
                  {deviceType === "GPON HW" || deviceType === "GPON MINI HW" && <Radio value={"view_info_onu"}>
                    Xem info Onu
                  </Radio>}

                </Space>
              </Radio.Group>
              <Form
                labelCol={{ span: 8 }}
                initialValues={{
                  size: "small",
                }}
                layout="horizontal"
                size={"small"}
                className="form-card"
                form={form2}

              >

              </Form>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Form
                labelCol={{ span: 8 }}
                initialValues={{
                  size: "small",
                }}
                layout="horizontal"
                size={"small"}
                className="form-card"
                form={form2}
                style={{ marginTop: 40 }}
              >
                <Form.Item label="Card" name="card" className="select-item">
                  <InputNumber placeholder="Nhập Card" />
                </Form.Item>
                <Form.Item label="Port" name="port" className="select-item">
                  <InputNumber placeholder="Nhập Port" />
                </Form.Item>
                <Form.Item label="Onu ID" name="onuId" className="select-item">
                  <InputNumber placeholder="Nhập Onu ID" />
                </Form.Item>

                <Form.Item label="SL ID" name="slId" className="select-item">
                  <Input placeholder="Nhập SL ID" />
                </Form.Item>
                {deviceType === "GPON HW" && radioValue === "create_dvnet" &&
                  <>
                    <Form.Item label="Port Vlan Net" name="portvlannet" className="select-item" rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Port Vlan Net",
                      },
                    ]}>
                      <InputNumber placeholder="Nhập Port Vlan Net" />
                    </Form.Item>
                    <Form.Item label="Port GNMS" name="portgnms" className="select-item" rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Port GNMS",
                      },
                    ]}>
                      <InputNumber placeholder="Nhập Port GNMS" />
                    </Form.Item>
                  </>

                }
                {deviceType === "GPON HW" && radioValue === "dv_ims" &&
                  <>
                    <Form.Item label="Port IMS" name="portims" className="select-item" rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Port IMS",
                      },
                    ]}>
                      <InputNumber placeholder="Nhập Port IMS" />
                    </Form.Item>

                  </>

                }
              </Form>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox h-full card-center">
              <Space direction="horizontal">
                <Button type="primary" onClick={handleRun} loading={runLoading}>
                  {runLoading ? "Loading" : "Run"}
                </Button>
                <Button type="primary" danger onClick={handleClear}>
                  {" "}
                  Clear Terminal{" "}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Gpon;
