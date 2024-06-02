/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// import { useState } from "react";
import { Menu, Button } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logoVnpt from "../../assets/images/logoVnpt.png";
import { MdDevicesOther } from "react-icons/md";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const tables = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const device = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M12 2C11.4477 2 11 2.44772 11 3V4.17651C8.51238 4.6197 6.6197 6.51238 6.17651 9H5C4.44772 9 4 9.44772 4 10V14C4 14.5523 4.44772 15 5 15H6.17651C6.6197 17.4876 8.51238 19.3803 11 19.8235V21C11 21.5523 11.4477 22 12 22H13C13.5523 22 14 21.5523 14 21V19.8235C16.4876 19.3803 18.3803 17.4876 18.8235 15H20C20.5523 15 21 14.5523 21 14V10C21 9.44772 20.5523 9 20 9H18.8235C18.3803 6.51238 16.4876 4.6197 14 4.17651V3C14 2.44772 13.5523 2 13 2H12ZM8 10H16V14H8V10ZM12 6C12.5523 6 13 6.44772 13 7C13 7.55228 12.5523 8 12 8C11.4477 8 11 7.55228 11 7C11 6.44772 11.4477 6 12 6ZM12 16C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16Z"
        fill={color}
      ></path>
    </svg>,

  ];

  const ipaddress = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93C7.06 18.42 4 15.07 4 12h2c0 2.21 1.79 4 4 4v3.93zm6.64-1.23L17 16.89C15.56 18.33 13.84 19 12 19v-3c1.3 0 2.4-.84 2.82-2h-2.82v-2h4c0 1.26-.4 2.4-1.07 3.35l1.48 1.48c.44-.72.75-1.54.91-2.41h2.02c-.2 1.19-.68 2.27-1.33 3.23zm-4.64-8.49h2v2h-2v-2zm-1-4h4v2h-4V6zm1 14.9V19c-1.84 0-3.56-.67-4.89-1.89L7.36 16.7A7.938 7.938 0 0012 20c.34 0 .68-.03 1-.1zM4.41 4.22L3 5.63 5.05 7.68C5.65 6.22 6.72 5.05 8.14 4.41L6.51 2.78C5.78 3.19 5.12 3.74 4.61 4.35L4.41 4.22zM18.36 3L20 4.64l-1.93 1.93c.41.76.75 1.57.99 2.42h2.02c-.22-1.19-.68-2.27-1.33-3.23l1.45-1.45-1.41-1.41L18.36 3zM13 12c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z"
        fill={color}
      ></path>
    </svg>,
  ];

  const vlannet = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM11.5 4H12.5C16.0899 4 19 6.91015 19 10.5V11.5C19 15.0899 16.0899 18 12.5 18H11.5C7.91015 18 5 15.0899 5 11.5V10.5C5 6.91015 7.91015 4 11.5 4ZM11.5 6C8.46243 6 6 8.46243 6 11.5V12.5C6 15.5376 8.46243 18 11.5 18H12.5C15.5376 18 18 15.5376 18 12.5V11.5C18 8.46243 15.5376 6 12.5 6H11.5ZM10 11H14V13H10V11Z"
        fill={color}
      />
    </svg>,
  ];

  const vlanmytv = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM11.5 4H12.5C16.0899 4 19 6.91015 19 10.5V11.5C19 15.0899 16.0899 18 12.5 18H11.5C7.91015 18 5 15.0899 5 11.5V10.5C5 6.91015 7.91015 4 11.5 4ZM11.5 6C8.46243 6 6 8.46243 6 11.5V12.5C6 15.5376 8.46243 18 11.5 18H12.5C15.5376 18 18 15.5376 18 12.5V11.5C18 8.46243 15.5376 6 12.5 6H11.5ZM10 11H14V13H10V11Z"
        fill={color}
      />
    </svg>,

  ];

  const vlanims = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM11.5 4H12.5C16.0899 4 19 6.91015 19 10.5V11.5C19 15.0899 16.0899 18 12.5 18H11.5C7.91015 18 5 15.0899 5 11.5V10.5C5 6.91015 7.91015 4 11.5 4ZM11.5 6C8.46243 6 6 8.46243 6 11.5V12.5C6 15.5376 8.46243 18 11.5 18H12.5C15.5376 18 18 15.5376 18 12.5V11.5C18 8.46243 15.5376 6 12.5 6H11.5ZM10 11H14V13H10V11Z"
        fill={color}
      />
    </svg>,
  ];

  return (
    <>
      <div className="brand">
        <img src={logoVnpt} alt="" />
        <span>App Auto Gpon Bras</span>
      </div>
      <hr />
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
          <NavLink to="/tables">
            <span
              className="icon"
              style={{
                background: page === "tables" ? color : "",
              }}
            >
              {tables}
            </span>
            <span className="label">BRAS</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item className="menu-item-header" key="5">
          Quản lí
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
        <Menu.Item key="5">
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
          </NavLink>
        </Menu.Item>
      </Menu>

    </>
  );
}

export default Sidenav;
