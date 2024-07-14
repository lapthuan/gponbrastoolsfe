import { Card, Form, InputNumber, Input } from "antd";

const DetailsForm = ({ form2, deviceType, radioValue }) => (
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
            <Form.Item label="Card" name="card" className="select-item" >
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
);

export default DetailsForm