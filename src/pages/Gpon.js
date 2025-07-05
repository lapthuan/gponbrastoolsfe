import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, message, Modal, Space, Tag } from "antd";
import { TerminalOutput } from "react-terminal-ui";
import ServiceDevice from "../service/ServiceDevice";
import ServiceGpon from "../service/ServiceGpon";
import { useForm } from "antd/es/form/Form";
import SwitchComponent from "../components/Switch/SwitchComponent";
import DeviceForm from "../components/Form/DeviceForm";
import UserForm from "../components/Form/UserForm";
import TerminalComponent from "../components/Terminal/TerminalComponent";
import RadioGroupComponent from "../components/Radio/RadioGroupComponent ";
import DetailsForm from "../components/Form/DetailsForm";
import ControlButtons from "../components/Form/ControlButtons";
import ServiceVisa from "../service/ServiceVisa";
import Title from "antd/lib/typography/Title";

function Gpon() {
  const [lineData, setLineData] = useState([
    <TerminalOutput key={"12312312312321312"}>
      {"typ:isadmin>#"}
    </TerminalOutput>,
  ]);

  const [runLoading, setRunLoading] = useState(false);
  const [checkCGNAT, setCheckCGNAT] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [vlanimsParam, setVlanImsParam] = useState("");
  const [vlanMytvParam, setVlanMytvParam] = useState("");
  const [inforUserVisa, setInforUserVisa] = useState(null);

  const [radioValue, setRadioValue] = useState(null);
  const [xgsponChecked, setXgsponChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userName, setUserName] = useState(false);
  const [openModalCGNAT, setOpenModalCGNAT] = useState(false);
  const [loadingUserName, setLoadingUserName] = useState(false);
  const [statusCGNAT, setStatusCGNAT] = useState("");

  const [deviceNames, setDeviceNames] = useState([]);
  const [deviceIps, setDeviceIps] = useState([]);
  const [deviceVlans, setDeviceVlans] = useState([]);

  const [selectedVlannet, setSelectedVlannet] = useState(null);
  const [selectedDeviceName, setSelectedDeviceName] = useState(null);
  const [selectedIp, setSelectedIp] = useState(null);

  const [form] = useForm();
  const [form2] = useForm();

  //Điều khiển các gpon thông thường
  const controlGpon = async (formValues, form2Values) => {
    console.log("aaaaaaaaaaaaa222222");

    try {
      let command = radioValue;
      if (
        formValues.deviceType === "GPON ALU" &&
        radioValue === "create_dvnet" &&
        xgsponChecked === true
      ) {
        command = "create_dvnet_xgspon";
      }

      //Kiểm tra cho gpon hw xgspon
      if (
        formValues.deviceType === "GPON HW XGSPON" &&
        radioValue === "create_dvnet" &&
        xgsponChecked === true
      ) {
        command = "create_dvnet_xgspon";
      }
      //body gửi đến server
      const data = {
        ipaddress: formValues.ipaddress,
        commands: command,
        device_types: formValues.deviceType,
        card: form2Values.card || 0,
        port: form2Values.port || 0,
        onu: form2Values.onuId || 0,
        slid: form2Values.slId || 0,
        vlanims: formValues.vlanims,
        vlanmytv: formValues.vlanmytv,
        vlannet: formValues.vlannet,
        service_portnet: form2Values.portvlannet || 0,
        service_portgnms: form2Values.portgnms || 0,
        service_portims: form2Values.portims || 0,
      };
      console.log(data);

      return;
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

  //Điều khiển gpon HW
  const controlGponHW = async (formValues, form2Values) => {
    console.log("aaaaaaaaaaaaa1111");

    try {
      const data = {
        ipaddress: formValues.ipaddress,
        commands: radioValue,
        device_types: formValues.deviceType,
        card: form2Values.card ? form2Values.card : 0,
        port: form2Values.port ? form2Values.port : 0,
        onu: form2Values.onuId ? form2Values.onuId : 0,
        slid: form2Values.slId ? form2Values.slId : 0,
        vlanims: formValues.vlanims,
        vlanmytv: formValues.vlanmytv,
        vlannet: formValues.vlannet,
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

  //Thực hiện kiểm tra và chạy lệnh
  //Kiểm tra các trường bắt buộc và gọi hàm điều khiển GPON
  const handleRun = async () => {
    try {
      const formValues = await form.validateFields();
      const form2Values = await form2.validateFields();

      if (radioValue === null) {
        message.error("Vui lòng chọn một chức năng.");
        return;
      }

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

      if (
        formValues.deviceType === "GPON HW" ||
        formValues.deviceType === "GPON MINI HW"
      ) {
        controlGponHW(formValues, form2Values);
      } else {
        controlGpon(formValues, form2Values);
      }
    } catch (error) {
      console.error("Validation failed:", error);
      setRunLoading(false);
      message.error("Vui lòng điền đầy đủ thông tin.");
    }
  };

  // 1. Khi chọn loại thiết bị → load danh sách tên
  useEffect(() => {
    if (!deviceType) return;
    form.resetFields([
      "deviceName",
      "ipaddress",
      "vlannet",
      "vlanims",
      "vlanmytv",
    ]);
    setDeviceNames([]);
    setDeviceIps([]);
    setDeviceVlans([]);

    const fetchByType = async () => {
      try {
        const res = await ServiceDevice.getAllDeviceByType({
          loaithietbi: deviceType,
        });
        setDeviceNames(res);
      } catch {
        message.error("Không thể tải tên thiết bị theo loại");
      }
    };
    fetchByType();
  }, [deviceType]);

  // 2. Khi chọn tên thiết bị → load IP
  useEffect(() => {
    if (!selectedDeviceName) return;
    form.resetFields([
      "ipaddress",
      "vlannet",
      "vlanims",
      "vlanmytv",
      "port",
      "card",
      "onuId",
      "slId",
    ]);

    setDeviceIps([]);
    setDeviceVlans([]);

    const fetchByName = async () => {
      try {
        //Tìm theo tên thiết bị
        const res = await ServiceDevice.getAllDeviceByName({
          name: selectedDeviceName,
        });
        //lấy thông tin IP của thiết bị đầu tiên
        const resDevice = res[0];
        setDeviceIps(Array(resDevice));
        //Gán thông tin để lấy được 2 VLANnet
        const vlanims = res[0].vlanims;
        const vlanmytv = res[0].vlanmytv;
        setVlanImsParam(res[0].vlanims);
        setVlanMytvParam(res[0].vlanmytv);
        setSelectedVlannet(res[0].vlannet);
        setDeviceVlans(res);

        form.setFieldsValue({
          ipaddress: resDevice.ipaddress,
          vlanims,
          vlanmytv,
        });
      } catch {
        message.error("Không thể tải IP theo tên thiết bị");
      }
    };
    fetchByName();
  }, [selectedDeviceName]);

  // 3. Khi chọn VlanNet -> Load VlanIMS, VlanMyTV
  useEffect(() => {
    if (!selectedVlannet) return;
    const fetchByVlannet = async () => {
      try {
        const res = await ServiceDevice.getAllDeviceByVlannet({
          vlannet: selectedVlannet,
        });
        // //Gán thông tin để lấy được 2 VLANnet
        // const vlanims = res[0].vlanims;
        // const vlanmytv = res[0].vlanmytv;
        // setVlanImsParam(res[0].vlanims);
        // setVlanMytvParam(res[0].vlanmytv);
        // form.setFieldsValue({
        //   vlanims,
        //   vlanmytv,
        // });
      } catch {
        message.error("Không thể tải VlanNet theo IP");
      }
    };
    fetchByVlannet();
  }, [selectedVlannet]);

  //Clear terminal output
  const handleClear = () => {
    setLineData([<TerminalOutput>{"typ:isadmin>#"}</TerminalOutput>]);
  };

  //Xử lý khi bật tắt switch
  //Khi bật thì hiện form User, tắt thì hiện form Device
  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    setDeviceType("");
    setRadioValue(null);
    setCheckCGNAT(null);
    form.resetFields();
    form2.resetFields();
  };

  //Lấy thông tin người dùng
  //Khi nhập tên người dùng và nhấn tìm kiếm, sẽ lấy thông tin người
  const handleGetUser = async () => {
    setLoadingUserName(true);
    try {
      form.resetFields([
        "deviceType",
        "deviceName",
        "ipaddress",
        "vlanims",
        "vlanmytv",
        "vlannet",
        "port",
        "card",
        "onuId",
      ]);
      const rs = await ServiceVisa.getUser({ username: userName });

      const user = rs.detail.data[0];
      setInforUserVisa(user);
      if (!user) {
        message.error("Không tìm thấy người dùng");
        setLoadingUserName(false);
        return;
      }
      // CGNAT check
      if (user.CGNAT === "CGNAT") {
        setStatusCGNAT("0");
        setCheckCGNAT("CGNAT");
      } else {
        setStatusCGNAT("1");
        setCheckCGNAT("UnCGNAT");
      }

      const resVlanNet = await ServiceDevice.getAllDeviceByName({
        name: user.SystemName,
      });
      //Tìm đúng thiết bị có SystemName tương ứng
      const deviceDetail = await ServiceDevice.getADevice(resVlanNet[0]._id);
      setDeviceType(deviceDetail.loaithietbi);
      setDeviceNames([{ tenthietbi: deviceDetail.tenthietbi }]);
      setDeviceIps([{ ipaddress: deviceDetail.ipaddress }]);
      setDeviceVlans([{ vlannet: deviceDetail.vlannet }]);
      setVlanImsParam(deviceDetail.vlanims);
      setVlanMytvParam(deviceDetail.vlanmytv);

      form.setFieldsValue({
        deviceType: deviceDetail.loaithietbi,
        deviceName: deviceDetail.tenthietbi,
        ipaddress: deviceDetail.ipaddress,
        vlanims: deviceDetail.vlanims,
        vlanmytv: deviceDetail.vlanmytv,
        vlannet: deviceDetail.vlannet,
      });

      form2.setFieldsValue({
        port: user.PortNo,
        card: user.SlotNo,
        onuId: user.OnuIndex,
      });
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
      message.warning("Không tìm thấy người dùng hoặc thiết bị");
    } finally {
      setLoadingUserName(false);
    }
  };

  //Mở modal CGNAT
  const handleOpenModal = () => {
    setOpenModalCGNAT(true);
  };

  const hideModalCGNAT = () => {
    setOpenModalCGNAT(false);
  };

  //Thay đổi trạng thái CGNAT
  //Khi nhấn nút Thay đổi trong modal, sẽ gọi API để thay đổi trạng thái CGNAT
  const handleChaneCGNAT = async () => {
    try {
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
          <Col xs={24} sm={24} md={9} lg={12} xl={5}>
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
                  setDeviceType={setDeviceType}
                  deviceType={deviceType}
                  deviceNames={deviceNames}
                  deviceIps={deviceIps}
                  deviceVlans={deviceVlans}
                  setSelectedDeviceName={setSelectedDeviceName}
                  setSelectedIp={setSelectedIp}
                  setSelectedVlannet={setSelectedVlannet}
                  vlanImsParam={vlanimsParam}
                  vlanMytvParam={vlanMytvParam}
                />
              ) : (
                <>
                  <UserForm
                    form={form}
                    handleOpenModal={handleOpenModal}
                    handleGetUser={handleGetUser}
                    loadingUserName={loadingUserName}
                    setUserName={setUserName}
                    setDeviceType={setDeviceType}
                    deviceType={deviceType}
                    deviceNames={deviceNames}
                    deviceIps={deviceIps}
                    deviceVlans={deviceVlans}
                    setSelectedDeviceName={setSelectedDeviceName}
                    setSelectedIp={setSelectedIp}
                    setSelectedVlannet={setSelectedVlannet}
                    vlanImsParam={vlanimsParam}
                    vlanMytvParam={vlanMytvParam}
                    inforUserVisa={inforUserVisa}
                  />
                </>
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
          <Col xs={24} sm={24} md={15} lg={12} xl={19} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <TerminalComponent lineData={lineData} />
              <RadioGroupComponent
                radioValue={radioValue}
                setRadioValue={setRadioValue}
                xgsponChecked={xgsponChecked}
                setXgsponChecked={setXgsponChecked}
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
