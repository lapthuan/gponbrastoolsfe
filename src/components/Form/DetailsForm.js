import { Card, Form, InputNumber, Input, Space } from "antd";

const DetailsForm = ({ form2, deviceType, radioValue }) => (
  <Form
    initialValues={{
      size: "small",
    }}
    layout="vertical"
    size={"small"}
    className="form-card"
    form={form2}
    style={{ marginBottom: 10 }}
  >
    <Space direction="horizontal" style={{ width: "100%" }}>
      <Form.Item
        style={{ marginBottom: 5, width: "100%" }}
        label="Card"
        name="card"
        className="select-item"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Card",
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%", height: "24px", borderRadius: 6 }}
          placeholder="Nhập Card"
        />
      </Form.Item>
      <Form.Item
        style={{ marginBottom: 5, width: "100%" }}
        label="Port"
        name="port"
        className="select-item"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Port",
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%", height: "24px", borderRadius: 6 }}
          placeholder="Nhập Port"
        />
      </Form.Item>
    </Space>

    <Space direction="horizontal" style={{ width: "100%" }}>
      <Form.Item
        style={{ marginBottom: 5, width: "100%", borderRadius: 6 }}
        label="Onu ID"
        name="onuId"
        className="select-item"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập Onu ID",
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%", height: "24px", borderRadius: 6 }}
          placeholder="Nhập Onu ID"
        />
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 5 }}
        label="SL ID"
        name="slId"
        className="select-item"
      >
        <Input
          style={{ width: "100%", height: "24px" }}
          placeholder="Nhập SL ID"
        />
      </Form.Item>
    </Space>

    {deviceType === "GPON HW" && radioValue === "create_dvnet" && (
      <>
        <Space direction="horizontal" style={{ width: "100%" }}>
          <Form.Item
            label="Port Vlan Net"
            name="portvlannet"
            className="select-item"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập Port Vlan Net",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%", height: "24px", borderRadius: 6 }}
              placeholder="Nhập Port Vlan Net"
            />
          </Form.Item>
          <Form.Item
            label="Port GNMS"
            name="portgnms"
            className="select-item"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập Port GNMS",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%", height: "24px", borderRadius: 6 }}
              placeholder="Nhập Port GNMS"
            />
          </Form.Item>
        </Space>
      </>
    )}
    {deviceType === "GPON HW" && radioValue === "dv_ims" && (
      <>
        <Form.Item
          label="Port IMS"
          name="portims"
          className="select-item"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Port IMS",
            },
          ]}
        >
          <InputNumber placeholder="Nhập Port IMS" />
        </Form.Item>
      </>
    )}
  </Form>
);

export default DetailsForm;
