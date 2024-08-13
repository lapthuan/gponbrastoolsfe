import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "../icon/icon.js";
import { FaNetworkWired } from "react-icons/fa";
function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const {
    dashboard,
    bras,
    device,
  } = Icon(color);

  return (
    <>

      <Menu theme="light" mode="inline">
        <Menu.Item key="1">
          <NavLink to="/gpon">
            <span
              className="icon"
              style={{
                background: page === "gpon" ? color : "",
              }}
            >
              {dashboard}
            </span>
            <span className="label">GPON</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/bras">
            <span
              className="icon"
              style={{
                background: page === "bras" ? color : "",
              }}
            >
              {bras}
            </span>
            <span className="label">BRAS</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="7">
          <NavLink to="/port">
            <span
              className="icon"
              style={{
                background: page === "port" ? color : "",
              }}
            >

              <FaNetworkWired
                color={color}
              />
            </span>

            <span className="label">Sync</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item className="menu-item-header" key="5">
          Quản lý
        </Menu.Item>
        {/* <Menu.Item key="8">
          <NavLink to="/suy-hao">
            <span
              className="icon"
              style={{
                background: page === "sheets" ? color : "",
              }}
            >
              {sheets}
            </span>
            <span className="label">Google sheets</span>
          </NavLink>
        </Menu.Item> */}
        <Menu.Item key="4">
          <NavLink to="/device">
            <span
              className="icon"
              style={{
                background: page === "device" ? color : "",
              }}
            >
              {device}
            </span>
            <span className="label">Thiết bị</span>
          </NavLink>
        </Menu.Item>
        {/* <Menu.Item key="5">
          <NavLink to="/ipaddress">
            <span
              className="icon"
              style={{
                background: page === "ipaddress" ? color : "",
              }}
            >
              {ipaddress}
            </span>
            <span className="label">Ip Address</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="6">
          <NavLink to="/vlanims">
            <span
              className="icon"
              style={{
                background: page === "vlanims" ? color : "",
              }}
            >
              {vlanims}
            </span>
            <span className="label">VlanIms</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="7">
          <NavLink to="/vlanmytv">
            <span
              className="icon"
              style={{
                background: page === "vlanmytv" ? color : "",
              }}
            >
              {vlanmytv}
            </span>
            <span className="label">VlanMyTV</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="8">
          <NavLink to="/vlannet">
            <span
              className="icon"
              style={{
                background: page === "vlannet" ? color : "",
              }}
            >
              {vlannet}
            </span>
            <span className="label">VlanNet</span>
          </NavLink> */}
        {/* </Menu.Item> */}
      </Menu>
    </>
  );
}

export default Sidenav;
