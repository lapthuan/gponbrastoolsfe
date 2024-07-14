import {
  Card,
  Col,
  Row,
  Typography,
  Button,
  Radio,
  Form,
  Input,
  Space,
  message,
  Upload,
  Progress,
} from "antd";
import { useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import ServiceBras from "../service/ServiceBras";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
const twoColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
};
const Bras = () => {
  const { Title } = Typography;
  const [lineData, setLineData] = useState([
    <TerminalOutput>{"bras_vlg_01@inoc2-T3200:~$"}</TerminalOutput>,
  ]);

  const [macAddress, setMacAddress] = useState("");
  const [userBras, setUserBras] = useState("");
  const [convertedMacAddress, setConvertedMacAddress] = useState("");
  const [fileUserBras, setFileUserBras] = useState("");
  const [radioValue, setRadioValue] = useState(null);
  const [macDisabled, setMacDisabled] = useState(true);
  const [userDisabled, setUserDisabled] = useState(true);
  const [userFileDisabled, setUserFileDisabled] = useState(true);
  const [onLoading, setOnLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [form] = useForm();

  const controlBras = async (data) => {
    try {
      const res = await ServiceBras.ControlBras(data);
      if (res.data && Array.isArray(res.data)) {
        const newLine = (
          <TerminalOutput key={lineData.length + 1}>
            {"  "}
            {res.data.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </TerminalOutput>
        );
        setLineData((prevLineData) => prevLineData.concat(newLine));
      } else {
        const newLine = (
          <TerminalOutput key={lineData.length + 1}>
            {"Unexpected response format"}
          </TerminalOutput>
        );
        setLineData((prevLineData) => prevLineData.concat(newLine));
      }
    } catch (error) {
      console.error("Error controlling BRAS:", error);
      // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo cho người dùng
    } finally {
      setOnLoading(false); // Kết thúc trạng thái loading sau khi nhận được phản hồi hoặc gặp lỗi
    }
  };

  const handleRun = async () => {
    try {
      let data = {};
      setOnLoading(true);
      // Kiểm tra xem người dùng đã chọn chức năng hay chưa
      if (radioValue === null && fileUserBras === "") {
        message.error(
          "Vui lòng chọn một chức năng hoặc đọc file danh sách người dùng."
        );
        setOnLoading(false);
        return;
      }

      // Kiểm tra xem người dùng đã chọn file hay chưa
      if (fileUserBras !== "") {
        const usernames = fileUserBras
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        // Format lại data body từ danh sách username trong file
        const formattedUsernames = `[${usernames.join(",")}]`;
        const arr = formattedUsernames.replace('[', '').replace(']', '').split(',');
        setProgress(0)
        const totalItems = arr.length;
        const timePerItem = 6 * 1000; // 6 giây cho mỗi phần tử


        if (totalItems > 0) {
          let currentProgress = 0;

          arr.forEach((item, index) => {
            setTimeout(() => {
              currentProgress = Math.floor(((index + 1) / totalItems) * 100);
              setProgress(currentProgress);
            }, timePerItem * (index + 1));
          });
        }
        data = {
          command: "clear_user_bras",
          username_bras: formattedUsernames,
        };
      } else {

        if (
          radioValue === "check_auth_mac" ||
          radioValue === "check_lock_mac"
        ) {
          if (convertedMacAddress.length !== 17) {
            message.error("Địa chỉ MAC phải đủ 12 ký tự.");
            setOnLoading(false);
            return;
          }
          data = { command: radioValue, mac: convertedMacAddress };
        } else if (radioValue === "check_user_bras") {
          if (userBras === "") {
            message.error("Vui lòng nhập username.");
            setOnLoading(false);
            return;
          }
          data = { command: "check_user_bras", username_bras: userBras };
        } else if (radioValue === "clear_user_bras") {
          if (userBras === "") {
            message.error("Vui lòng nhập username.");
            setOnLoading(false);
            return;
          }

          if (/[;:!$+={}''""\s]/.test(userBras)) {
            message.warning(
              "Các username phải được ngăn cách nhau bởi dấu phẩy (,). Vui lòng kiểm tra lại."
            );
            setOnLoading(false);
            return;
          }

          const usernames = userBras.split(",").map((user) => user.trim());
          if (usernames.length === 1) {
            const formattedUsernames = `[${usernames.join(",")}]`;
            data = {
              command: "clear_user_bras",
              username_bras: formattedUsernames,
            };
          }

          if (usernames.length > 1 && !userBras.includes(",")) {
            message.error("Các username được ngăn cách nhau bởi dấu phẩy (,).");
            setOnLoading(false);
            return;
          }

          const formattedUsernames = `[${usernames.join(",")}]`;
          data = {
            command: "clear_user_bras",
            username_bras: formattedUsernames,
          };
        } else {
          data = { command: radioValue };
        }
      }

      const newLine = (
        <TerminalOutput key={lineData.length + 1}>
          {"bras_vlg_01@inoc2-T3200:~$ ..."}
        </TerminalOutput>
      );
      setLineData((prevLineData) => prevLineData.concat(newLine));
      console.log(data);
      controlBras(data);
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Vui lòng điền đầy đủ thông tin.");
      setOnLoading(false);
    }
  };

  const handleChange = (event) => {
    setMacAddress(event.target.value);
    if (event.target.value !== "") {
      setConvertedMacAddress(convertMacAddress(event.target.value));
    } else {
      setConvertedMacAddress("");
    }
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setRadioValue(value);
    if (value === "check_auth_mac" || value === "check_lock_mac") {
      setUserBras("");
      setMacDisabled(false);
      setUserDisabled(true);
      setUserFileDisabled(true);
    } else if (value === "check_user_bras" || value === "clear_user_bras") {
      setMacAddress("");
      setFileUserBras("");
      setUserDisabled(false);
      setMacDisabled(true);
      setUserFileDisabled(true);
    } else if (value === "clear_user_bras_file") {
      setMacAddress("");
      setUserBras("");
      setUserDisabled(true);
      setMacDisabled(true);
      setUserFileDisabled(false);
    } else {
      setMacDisabled(true);
      setUserDisabled(true);
    }
  };
  const convertMacAddress = (mac) => {
    const cleanMac = mac.replace(/[^a-zA-Z0-9]/g, "");
    const formattedMac = cleanMac.match(/.{1,2}/g).join(":");
    return formattedMac;
  };

  const handleClear = () => {
    setLineData([
      <TerminalOutput key={lineData.length + 1}>{"bras_vlg_01@inoc2-T3200:~$"}</TerminalOutput>,
    ]);
  };

  const customRequest = ({ file, onSuccess }) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setFileUserBras(text); // Lưu nội dung tệp vào state
      };
      reader.readAsText(file);
    }
    console.log(fileUserBras);
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  // Xử lý đọc file txt

  return (
    <>
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div>
                <Title level={5}>Thông số</Title>
              </div>
              <Form
                labelCol={{ span: 10 }}
                initialValues={{ size: "small" }}
                layout="vertical"
                size="small"
                className="form-card"
                form={form}
              >
                <Radio.Group onChange={handleRadioChange}>
                  <Space direction="vertical">
                    <Radio value="check_auth_mac">Kiểm tra xác thực MAC</Radio>
                    <Radio value="check_lock_mac">
                      Kiểm tra mac bị khóa trên BRAS
                    </Radio>
                    <Radio value="check_user_bras">
                      Kiểm tra user trên BRAS
                    </Radio>
                    <Radio value="clear_user_bras">
                      Clear xác thực user trên BRAS
                    </Radio>
                    <Radio value="clear_user_bras_file">
                      Clear xác thực user trên BRAS <strong>(File)</strong>
                    </Radio>
                    <Radio value="clear_in_bras">Clear BRAS</Radio>
                  </Space>
                </Radio.Group>

                <Space size="middle" style={{ paddingTop: 10 }}>
                  <div>
                    <p>Địa chỉ MAC:</p>

                    <Input
                      type="text"
                      placeholder="Nhập chuỗi 12 ký tự "
                      value={macAddress}
                      onChange={handleChange}
                      disabled={macDisabled}
                    />
                  </div>
                  <div>
                    <p>Username:</p>
                    <Input
                      type="text"
                      placeholder="Nhập username"
                      value={userBras}
                      onChange={(e) => setUserBras(e.target.value)}
                      disabled={userDisabled}
                    />
                  </div>
                </Space>
                {!userFileDisabled && <> <Space size="left" style={{ paddingTop: 10 }}>
                  <div>
                    <p>Chọn file chứa danh sách tên người dùng</p>
                    <Upload
                      customRequest={customRequest}
                      maxCount={1}

                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </div>

                </Space>
                  {onLoading && <Progress strokeLinecap="butt" percent={progress} strokeColor={twoColors} />}
                </>
                }


              </Form>


              <div style={{ marginTop: 10 }}>
                <Button type="primary" onClick={handleRun} loading={onLoading}>
                  {onLoading ? "Loading" : "Run"}
                </Button>
                <Space direction="vertical" style={{ marginLeft: "10px" }}>
                  <Button type="primary" danger onClick={handleClear}>
                    {" "}
                    Clear{" "}
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={18} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Terminal
                style={{ maxWidth: "150px" }}
                height="50vh"
                colorMode={ColorMode.Dark}
              >
                {lineData}
              </Terminal>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Bras;
