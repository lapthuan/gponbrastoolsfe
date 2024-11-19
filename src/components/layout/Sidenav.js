import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "../icon/icon.js";
import { FaNetworkWired, FaUser } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
const cookies = new Cookies();

function Sidenav({ color }) {
  const [decodedToken, setDecodedToken] = useState("");

  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const {
    dashboard,
    bras,
    device,
  } = Icon(color);
  useEffect(() => {
    const myCookieValue = cookies.get("token")


    if (myCookieValue) {
      const decodedToken = jwtDecode(myCookieValue);
      setDecodedToken(decodedToken)
      console.log(decodedToken);

    }
  }, []);
  return (
    <>

      <Menu theme="light" mode="inline">
        {(decodedToken?.role === "user" || decodedToken?.role === "user gpon" || decodedToken?.role === "admin")  && (
          <>
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
            <Menu.Item key="8">
              <NavLink to="/list">
                <span
                  className="icon"
                  style={{
                    background: page === "list" ? color : "",
                  }}
                >

                  <FaListCheck
                    color={color}
                  />
                </span>

                <span className="label">List</span>
              </NavLink>
            </Menu.Item></>)}
        {(decodedToken?.role === "user" || decodedToken?.role === "user bras" || decodedToken?.role === "admin") && (<>  <Menu.Item key="2">
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
        </Menu.Item></>)}


        {decodedToken?.role === "admin" && (<>  <Menu.Item className="menu-item-header" key="5">
          Quản lý
        </Menu.Item>

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
          <Menu.Item key="9">
            <NavLink to="/user">
              <span
                className="icon"
                style={{
                  background: page === "user" ? color : "",
                }}
              >
                <FaUser
                  color={color}
                />
              </span>
              <span className="label">User</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="9">
            <NavLink to="/log">
              <span
                className="icon"
                style={{
                  background: page === "log" ? color : "",
                }}
              >
                <FaUser
                  color={color}
                />
              </span>
              <span className="label">Log</span>
            </NavLink>
          </Menu.Item>
          </>)}



      </Menu>
    </>
  );
}

export default Sidenav;
