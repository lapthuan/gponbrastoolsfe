
import Terminal, { ColorMode } from "react-terminal-ui";

const TerminalComponent = ({ lineData }) => (
  
        <Terminal style={{ maxWidth: "200px" }} height="75vh" colorMode={ColorMode.Dark} >
            {lineData}
        </Terminal>

);

export default TerminalComponent