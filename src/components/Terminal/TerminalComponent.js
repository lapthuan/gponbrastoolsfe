import { Card } from "antd";
import Terminal, { ColorMode } from "react-terminal-ui";

const TerminalComponent = ({ lineData }) => (
    <Card bordered={false} className="criclebox h-full" >
        <Terminal style={{ maxWidth: "150px" }} height="55vh" colorMode={ColorMode.Dark} >
            {lineData}
        </Terminal>
    </Card>
);

export default TerminalComponent