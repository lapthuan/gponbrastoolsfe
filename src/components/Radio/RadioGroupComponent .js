import { Divider, Radio } from "antd";

const RadioGroupComponent = ({ radioValue, setRadioValue, deviceType }) => (
  <>
    <p style={{ color: "#1f7ed0", margin: 5 }}>CHỨC NĂNG</p>

    <div className="radio-group-container">
      <Radio.Group
        className="radio-group"
        onChange={(e) => setRadioValue(e.target.value)}
        value={radioValue}
      >
        <div className="column">
          <Radio value={"sync_password"}>Xem Password đồng bộ</Radio>
          <Radio value={"check_mac"}>Xem Mac</Radio>
          <Radio
            disabled={deviceType === "GPON ALU" ? false : true}
            value={"status_port"}
          >
            Xem trạng thái port (GPON ALU)
          </Radio>
          <Radio
            disabled={
              deviceType === "GPON MINI HW" || deviceType === "GPON HW"
                ? false
                : true
            }
            value={"view_info_onu"}
          >
            Xem info (GPON MINI HW && GPOM HW)
          </Radio>
          <Radio
            disabled={deviceType === "GPON ALU" ? false : true}
            value={"reboot_alu"}
          >
            Reboot Modem ALU
          </Radio>
        </div>
        <div className="column">
          <Radio value={"check_capacity"}>Kiểm tra công suất</Radio>
          <Radio
            disabled={
              deviceType === "GPON HW" || deviceType === "GPON MINI HW"
                ? false
                : true
            }
            value={"check_service_port"}
          >
            Kiểm tra service port cho OLT HW
          </Radio>
          <Radio
            disabled={
              deviceType === "GPON HW" || deviceType === "GPON MINI HW"
                ? false
                : true
            }
            value={"reboot_hw"}
          >
            Reboot Modem HW & MINI HW
          </Radio>
          <Radio
            disabled={
              deviceType === "GPON ZTE" || deviceType === "GPON MINI ZTE"
                ? false
                : true
            }
            value={"reboot_zte"}
          >
            Reboot Modem ZTE & MINI ZTE
          </Radio>
          <Radio
            disabled={
              deviceType === "GPON ZTE" || deviceType === "GPON MINI ZTE"
                ? false
                : true
            }
            value={"delete_wan_ip_zte"}
          >
            Xóa wan ip cho onu loại ZTE
          </Radio>
        </div>
        <div className="column">
          <Radio value={"change_sync_password"}>Đổi Password đồng bộ</Radio>
          <Radio value={"delete_port"}>Xóa Port</Radio>
          <Radio value={"create_dvnet"}>Tạo DV_NET</Radio>
          <Radio value={"dv_mytv"}>Tạo DV_MYTV</Radio>
          <Radio value={"dv_ims"}>Tạo DV_IMS</Radio>
        </div>
      </Radio.Group>
    </div>
  </>
);
export default RadioGroupComponent;
