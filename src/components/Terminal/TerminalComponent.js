import { Card } from "antd";
import Terminal, { ColorMode } from "react-terminal-ui";

const TerminalComponent = ({ lineData, terminalRef }) => (
    <Card bordered={false} className="criclebox h-full" ref={terminalRef}>
        <Terminal style={{ maxWidth: "150px" }} height="55vh" colorMode={ColorMode.Dark} ref={terminalRef}>
            {lineData}
        </Terminal>
    </Card>
);

export default TerminalComponent