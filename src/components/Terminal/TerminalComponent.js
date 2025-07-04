import { Space, Descriptions } from "antd";
import Terminal, { ColorMode } from "react-terminal-ui";

const TerminalComponent = ({ inforUserVisa, lineData }) => (
  <>
    {inforUserVisa && inforUserVisa != null ? (
      <Space direction="vertical" style={{ width: "100%", height: "100%" }}>
        <Descriptions
          bordered
          column={4}
          size="small"
          labelStyle={{ fontWeight: "bold", fontSize: 12 }}
        >
          <Descriptions.Item label="Type ID" style={{ fontSize: 12 }}>
            {inforUserVisa?.TypeId || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Framed Pool" style={{ fontSize: 12 }}>
            {inforUserVisa?.FramedPool || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Framed Route" style={{ fontSize: 12 }}>
            {inforUserVisa?.FramedRoute || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="framed IP Address" style={{ fontSize: 12 }}>
            {inforUserVisa?.FrameIpAddress || "N/A"}
          </Descriptions.Item>
        </Descriptions>

        <Terminal
          style={{ maxWidth: "200px" }}
          height="71vh"
          colorMode={ColorMode.Dark}
        >
          {lineData}
        </Terminal>
      </Space>
    ) : (
      <Terminal
        style={{ maxWidth: "200px" }}
        height="71vh"
        colorMode={ColorMode.Dark}
      >
        {lineData}
      </Terminal>
    )}
  </>
);

export default TerminalComponent;
