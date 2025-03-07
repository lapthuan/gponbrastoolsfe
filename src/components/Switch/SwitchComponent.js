import { Space, Switch } from "antd";
import Title from "antd/lib/typography/Title";

const SwitchComponent = ({ isChecked, handleSwitchChange }) => (
  <div>
    <Space direction="horizontal">
      <span style={{ fontWeight: "bold" }} level={5}>
        Thông số:{" "}
      </span>
      <Switch
        checked={isChecked}
        onChange={handleSwitchChange}
        checkedChildren="Tài khoản"
        unCheckedChildren="Thiết bị"
      />
    </Space>
  </div>
);

export default SwitchComponent;
