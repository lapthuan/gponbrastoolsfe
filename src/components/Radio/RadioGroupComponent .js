import { Card, Radio } from "antd";
import Title from "antd/lib/typography/Title";

const RadioGroupComponent = ({ radioValue, setRadioValue, deviceType }) => (
    <Card bordered={false} className="criclebox cardbody h-full">
        <div className="ml-16">
            <Title level={5}>Chức năng</Title>
        </div>
        <Radio.Group className="ml-16 mt-25" onChange={(e) => setRadioValue(e.target.value)} value={radioValue}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <Radio value={"sync_password"}>Xem Password đồng bộ</Radio>
                <Radio value={"change_sync_password"}>Đổi Password đồng bộ</Radio>
                <Radio value={"delete_port"}>Xóa Port</Radio>
                <Radio value={"check_mac"}>Xem Mac</Radio>

                <Radio value={"create_dvnet"}>Tạo DV_NET</Radio>
                <Radio value={"dv_mytv"}>Tạo DV_MYTV</Radio>
                <Radio value={"dv_ims"}>Tạo DV_IMS</Radio>
                <Radio value={"check_capacity"}>Kiểm tra công suất</Radio>
                <Radio disabled={deviceType === "GPON ALU" ? false : true} value={"status_port"}>
                    Xem trạng thái port (GPON ALU)
                </Radio>
                <Radio disabled={deviceType === "GPON MINI HW" || deviceType === "GPON HW" ? false : true} value={"view_info_onu"}>
                    Xem info (GPON MINI HW && GPOM HW)
                </Radio>
                <Radio disabled={deviceType === "GPON HW" || deviceType === "GPON MINI HW" ? false : true} value={"check_service_port"}>Kiểm tra service port cho OLT HW</Radio>
            </div>
        </Radio.Group>
    </Card>
);
export default RadioGroupComponent;
