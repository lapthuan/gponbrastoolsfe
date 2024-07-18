
import Terminal, { ColorMode } from "react-terminal-ui";

const TerminalComponent = ({ lineData }) => (
  
        <Terminal style={{ maxWidth: "150px" }} height="70vh" colorMode={ColorMode.Dark} >
            {lineData}
        </Terminal>

);

export default TerminalComponent