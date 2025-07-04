import { Form, Input, Select, Space } from "antd";
import { useEffect } from "react";
import ServiceDeviceType from "../../service/ServiceDeviceType";
import useAsync from "../../hook/useAsync";

const DeviceForm = ({
  form,
  setDeviceType,
  deviceType,
  deviceNames,
  deviceIps,
  deviceVlans,
  setSelectedDeviceName,
  setSelectedIp,
  vlanMytvParam,
  vlanImsParam,
  setSelectedVlannet,
}) => {
  //Load loại thiết bị
  const { data: dataDeviceType } = useAsync(() =>
    ServiceDeviceType.getAllDeviceType()
  );

  useEffect(() => {
    form.setFieldsValue({
      vlanims: vlanImsParam,
      vlanmytv: vlanMytvParam,
    });
  }, [vlanImsParam, vlanMytvParam]);

  return (
    <Form
      form={form}
      initialValues={{ size: "small" }}
      layout="vertical"
      size="small"
      className="form-card"
      style={{ marginTop: 10 }}
    >
      {/* Loại thiết bị */}
      <Form.Item
        label="Loại thiết bị"
        name="deviceType"
        style={{ marginBottom: 10 }}
        rules={[{ required: true, message: "Vui lòng chọn loại thiết bị" }]}
      >
        <Select
          placeholder="Chọn loại thiết bị"
          style={{ width: "100%" }}
          onChange={(value) => setDeviceType(value)}
          allowClear
        >
          {dataDeviceType?.map((device) => (
            <Select.Option key={device._id} value={device.typename}>
              {device.typename}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Tên thiết bị */}
      <Form.Item
        label="Thiết bị"
        name="deviceName"
        style={{ marginBottom: 10 }}
        rules={[{ required: true, message: "Vui lòng chọn thiết bị" }]}
      >
        <Select
          placeholder="Chọn thiết bị"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedDeviceName(value)}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {deviceNames?.map((device) => (
            <Select.Option key={device._id} value={device.tenthietbi}>
              {device.tenthietbi}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* IP */}
      <Form.Item
        label="IP"
        name="ipaddress"
        style={{ marginBottom: 10 }}
        rules={[{ required: true, message: "Vui lòng chọn IP" }]}
      >
        <Select
          placeholder="Chọn IP"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedIp(value)}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {deviceIps?.map((item) => (
            <Select.Option key={item._id} value={item.ipaddress}>
              {item.ipaddress}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Vlan Net */}
      <Form.Item
        label="Vlan Net"
        name="vlannet"
        style={{ marginBottom: 10 }}
        rules={[{ required: true, message: "Vui lòng chọn Vlan Net" }]}
      >
        <Select
          placeholder="Chọn Vlan Net"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedVlannet(value)}
          allowClear
          showSearch
          optionFilterProp="children"
          value={deviceVlans.vlannet}
        >
          {deviceVlans?.map((item) => (
            <Select.Option key={item._id} value={item.vlannet}>
              {item.vlannet}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Space direction="horizontal" style={{ width: "100%" }}>
        {/* Vlan MyTV */}
        <Form.Item
          label="Vlan MyTV"
          name="vlanmytv"
          style={{ marginBottom: 5 }}
          rules={[{ required: true, message: "Vui lòng chọn Vlan MyTV" }]}
        >
          <Input style={{ width: "100%", height: "24px" }} disabled />
        </Form.Item>

        {/* Vlan IMS */}
        <Form.Item
          label="Vlan IMS"
          name="vlanims"
          style={{ marginBottom: 5 }}
          rules={[{ required: true, message: "Vui lòng chọn Vlan IMS" }]}
        >
          <Input style={{ width: "100%", height: "24px" }} disabled />
        </Form.Item>
      </Space>
    </Form>
  );
};
export default DeviceForm;
