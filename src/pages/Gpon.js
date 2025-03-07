import { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Row,
  message,
  Modal,
  Select,
  Space,
  Tag,
  Button,
} from "antd";
import { TerminalOutput } from "react-terminal-ui";
import useAsync from "../hook/useAsync";
import ServiceIp from "../service/ServiceIp";
import ServiceVlanIMS from "../service/ServiceVlanIMS";
import ServiceVlanMyTV from "../service/ServiceVlanMyTV";
import ServiceVlanNet from "../service/ServiceVlanNet";
import ServiceDevice from "../service/ServiceDevice";
import ServiceGpon from "../service/ServiceGpon";
import { useForm } from "antd/es/form/Form";
import ServiceUser from "../service/ServiceUser";
import SwitchComponent from "../components/Switch/SwitchComponent";
import DeviceForm from "../components/Form/DeviceForm";
import UserForm from "../components/Form/UserForm";
import TerminalComponent from "../components/Terminal/TerminalComponent";
import RadioGroupComponent from "../components/Radio/RadioGroupComponent ";
import DetailsForm from "../components/Form/DetailsForm";
import ControlButtons from "../components/Form/ControlButtons";
import ServiceVisa from "../service/ServiceVisa";
import Title from "antd/lib/typography/Title";
import { RiSafariLine } from "react-icons/ri";

function Gpon() {
  const [lineData, setLineData] = useState([
    <TerminalOutput key={"12312312312321312"}>
      {"typ:isadmin>#"}
    </TerminalOutput>,
  ]);

  const [runLoading, setRunLoading] = useState(false);
  const [checkCGNAT, setCheckCGNAT] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [selectDevices, setSelectDevices] = useState();
  const [radioValue, setRadioValue] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [userName, setUserName] = useState(false);
  const [openModalCGNAT, setOpenModalCGNAT] = useState(false);
  const [loadingUserName, setLoadingUserName] = useState(false);
  const [vlanNetOneDevice, setVlanNetOneDevice] = useState([]);
  const [statusCGNAT, setStatusCGNAT] = useState("");
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
      setRunLoading(false);
      if (error.response.data.detail)
        message.warning(error.response.data.detail);
      else message.warning("Max Sessions Reached");
      console.error("Error controlling GPON:", error);
      // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo cho người dùng
    } finally {
      setRunLoading(false);
    }
  };
  const controlGponHW = async (
    mytv,
    net,
    ims,
    ip,
    loaithietbi,
    form2Values
  ) => {
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
      setRunLoading(false);
      if (error.response.data.detail)
        message.warning(error.response.data.detail);
      else message.warning("Max Sessions Reached");

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
        if (deviceType === "GPON HW" && form2Values.portvlannet === undefined) {
          message.warning("Nhập thiếu Port Vlan Net");
          return;
        }
        if (deviceType === "GPON HW" && form2Values.portgnms === undefined) {
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
        if (deviceType === "GPON HW" && form2Values.portims === undefined) {
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
      if (device === undefined) {
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
      if (deviceType === "GPON HW" || deviceType === "GPON MINI HW") {
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
  const handleSelectDeviceType = (value) => {
    setDeviceType(value);
  };
  useEffect(() => {
    if (isChecked === false)
      if (deviceType) {
        form.setFieldsValue({
          deviceName: null,
          ipaddress: null,
          vlanims: null,
          vlanmytv: null,
          vlannet: null,
        });

        form2.setFieldsValue({
          port: null,
          card: null,
          onuId: null,
        });
        if (deviceType === "GPON MINI ZTE") {
          form2.setFieldsValue({ card: 3 });
        }
        if (deviceType === "GPON MINI HW") {
          form2.setFieldsValue({ card: 1 });
        }
        setLoadingDevices(true);
        const getDevice = async () => {
          try {
            const res = await ServiceDevice.getDevice(deviceType);
            setRadioValue(null);
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
  }, [deviceType, form, isChecked, form2]);

  useEffect(() => {
    if (selectDevices) {
      const getADV = async () => {
        try {
          const res = await ServiceDevice.getADevice(selectDevices);

          const resVlanNet = await ServiceVlanNet.getManyVlanNet(
            res.tenthietbi
          );
          setVlanNetOneDevice(resVlanNet);
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
  }, [selectDevices, form, dataDevice]);
  useEffect(() => {
    if (ipAddress) {
      const getADV = async () => {
        try {
          const ip = dataIp.find((ips) => ips._id === ipAddress);
          const resDevice = await ServiceDevice.getAlldevice();
          setDevices(resDevice);
          const res = await ServiceIp.getDeviceByIp(ip.ipaddress);

          const resVlanNet = await ServiceVlanNet.getManyVlanNet(
            res[0].tenthietbi
          );
          setVlanNetOneDevice(resVlanNet);
          form.setFieldsValue({
            deviceType: res[0].loaithietbi,
            deviceName: res[0]._id,
            ipaddress: res[0].ipaddress._id,
            vlanims: res[0].vlanims._id,
            vlanmytv: res[0].vlanmytv._id,
            vlannet: res[0].vlannet._id,
          });
        } catch (error) {
          console.error("Error fetching device data:", error);
        }
      };

      getADV();
    }
  }, [ipAddress, form, dataDevice]);

  const handleClear = () => {
    setLineData([<TerminalOutput>{"typ:isadmin>#"}</TerminalOutput>]);
  };
  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    setDeviceType("");
    setRadioValue(null);
    setCheckCGNAT(null);
    form.resetFields();
    form2.resetFields();
  };

  const handleGetUser = async () => {
    setLoadingUserName(true);
    try {
      form.setFieldsValue({
        deviceName: null,
        ipaddress: null,
        vlanims: null,
        vlanmytv: null,
        vlannet: null,
      });

      form2.setFieldsValue({
        port: null,
        card: null,
        onuId: null,
      });
      const rs = await ServiceVisa.getUser({ username: userName });

      if (rs.detail.data[0] && rs.detail.data[0].CGNAT === "CGNAT") {
        setStatusCGNAT("0");
        setCheckCGNAT(rs.detail.data[0].CGNAT);
      } else {
        setStatusCGNAT("1");
        setCheckCGNAT("UnCGNAT");
      }

      const idDevice = dataDevice.find(
        (device) => device.tenthietbi === rs.detail.data[0].SystemName
      );

      const resVlanNet = await ServiceVlanNet.getManyVlanNet(
        rs.detail.data[0].SystemName
      );
      setVlanNetOneDevice(resVlanNet);
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
      setDeviceType(res.loaithietbi);
      setLoadingUserName(false);
    } catch (error) {
      message.warning("Không tìm thấy người dùng");
      setLoadingUserName(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModalCGNAT(true);
  };

  const hideModalCGNAT = () => {
    setOpenModalCGNAT(false);
  };

  const handleChaneCGNAT = async () => {
    try {
      console.log(statusCGNAT);
      console.log(userName);

      setRunLoading(true);
      if (statusCGNAT != null && userName != null) {
        const res = await ServiceVisa.change_cgnat({
          accountName: userName,
          status: statusCGNAT,
        });

        if (res?.detail === "Không có sự thay đổi") {
          message.error(res?.detail);
        } else if (res?.message === "Thay đổi thành công") {
          // Sửa lỗi truy cập
          message.success(res?.message);
        } else {
          message.error("Không tìm thấy tài khoản người dùng");
        }
        const rs = await ServiceVisa.getUser({ username: userName });
        console.log(rs);
        if (rs.detail.data[0] && rs.detail.data[0].CGNAT === "CGNAT") {
          setStatusCGNAT("0");
          setCheckCGNAT(rs.detail.data[0].CGNAT);
        } else {
          setStatusCGNAT("1");
          setCheckCGNAT("UnCGNAT");
        }
        setOpenModalCGNAT(false);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      message.error("Không tìm thấy tài khoản người dùng");
      setOpenModalCGNAT(false);
    } finally {
      setRunLoading(false);
    }
  };

  return (
    <>
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={5} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Space direction="horizontal" style={{ padding: 5 }}>
                <SwitchComponent
                  isChecked={isChecked}
                  handleSwitchChange={handleSwitchChange}
                />
                {checkCGNAT === "CGNAT" ? (
                  <Tag
                    color="green"
                    onClick={handleOpenModal}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    &#10004; CGNAT
                  </Tag>
                ) : checkCGNAT === "UnCGNAT" ? (
                  <Tag
                    color="red"
                    onClick={handleOpenModal}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    &#10006; CGNAT
                  </Tag>
                ) : (
                  <></>
                )}
              </Space>

              {isChecked === false ? (
                <DeviceForm
                  form={form}
                  deviceType={deviceType}
                  setDeviceType={setDeviceType}
                  devices={devices}
                  loadingDevices={loadingDevices}
                  setSelectDevices={setSelectDevices}
                  dataIp={dataIp}
                  loadingIp={loadingIp}
                  dataVlanNet={dataVlanNet}
                  vlanNetOneDevice={vlanNetOneDevice}
                  loadingVlanNet={loadingVlanNet}
                  dataVlanMyTV={dataVlanMyTV}
                  loadingVlanMyTV={loadingVlanMyTV}
                  dataVlanIMS={dataVlanIMS}
                  loadingVlanIMS={loadingVlanIMS}
                  setIpAddress={setIpAddress}
                />
              ) : (
                <UserForm
                  form={form}
                  handleOpenModal={handleOpenModal}
                  handleGetUser={handleGetUser}
                  loadingUserName={loadingUserName}
                  dataDevice={dataDevice}
                  setUserName={setUserName}
                  handleSelectDeviceType={handleSelectDeviceType}
                  loadingDevice={loadingDevice}
                  dataIp={dataIp}
                  loadingIp={loadingIp}
                  dataVlanNet={dataVlanNet}
                  vlanNetOneDevice={vlanNetOneDevice}
                  loadingVlanNet={loadingVlanNet}
                  dataVlanMyTV={dataVlanMyTV}
                  loadingVlanMyTV={loadingVlanMyTV}
                  dataVlanIMS={dataVlanIMS}
                  loadingVlanIMS={loadingVlanIMS}
                />
              )}
              <DetailsForm
                form2={form2}
                deviceType={deviceType}
                radioValue={radioValue}
              />
              <ControlButtons
                handleRun={handleRun}
                runLoading={runLoading}
                handleClear={handleClear}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={19} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <TerminalComponent lineData={lineData} />
              <RadioGroupComponent
                radioValue={radioValue}
                setRadioValue={setRadioValue}
                deviceType={deviceType}
              />
            </Card>
          </Col>
        </Row>

        <Modal
          title="Thay đổi CGNAT"
          visible={openModalCGNAT}
          onOk={handleChaneCGNAT}
          onCancel={hideModalCGNAT}
          okText="Thay đổi"
          cancelText="Hủy"
          confirmLoading={runLoading}
        >
          {checkCGNAT === "CGNAT" ? (
            <Title level={5}>
              Xác nhận chuyển đổi sang{" "}
              <Tag color="red" style={{ fontSize: "16px" }}>
                Ip động public
              </Tag>
            </Title>
          ) : (
            <Title level={5}>
              Xác nhận chuyển đổi sang{" "}
              <Tag color="green" style={{ fontSize: "16px" }}>
                CGNAT
              </Tag>
            </Title>
          )}
        </Modal>
      </div>
    </>
  );
}

export default Gpon;
