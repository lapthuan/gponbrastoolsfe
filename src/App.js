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
import { Switch, Route, Redirect } from "react-router-dom";
import Gpon from "./pages/Gpon";
import Main from "./components/layout/Main";
import SignIn from "./pages/SignIn";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Bras from "./pages/Bras";
import Device from "./pages/Device";
import IpAddress from "./pages/IpAddress";
import VlanIms from "./pages/VlanIms";
import VlanMyTV from "./pages/VlanMyTV";
import VlanNet from "./pages/VlanNet";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/sign-in" component={SignIn} />
        <Main>
          <Route exact path="/" component={Gpon} />
          <Route exact path="/gpon" component={Gpon} />
          <Route exact path="/bras" component={Bras} />
          <Route exact path="/device" component={Device} />
          <Route exact path="/ipaddress" component={IpAddress} />
          <Route exact path="/vlanims" component={VlanIms} />
          <Route exact path="/vlanmytv" component={VlanMyTV} />
          <Route exact path="/vlannet" component={VlanNet} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
