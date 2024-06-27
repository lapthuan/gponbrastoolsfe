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
import SignIn from "./pages/Sigin";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Bras from "./pages/Bras";
import Device from "./pages/Device";
import IpAddress from "./pages/IpAddress";
import VlanIms from "./pages/VlanIms";
import VlanMyTV from "./pages/VlanMyTV";
import VlanNet from "./pages/VlanNet";
import SuyHao from "./pages/Suyhao";
import PrivateRoute from "./privateRouter";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={SignIn} />
        <Main>
          <PrivateRoute exact path="/" component={Gpon} />
          <PrivateRoute exact path="/gpon" component={Gpon} />
          <PrivateRoute exact path="/bras" component={Bras} />
          <PrivateRoute exact path="/device" component={Device} />
          <PrivateRoute exact path="/ipaddress" component={IpAddress} />
          <PrivateRoute exact path="/vlanims" component={VlanIms} />
          <PrivateRoute exact path="/vlanmytv" component={VlanMyTV} />
          <PrivateRoute exact path="/vlannet" component={VlanNet} />
          <PrivateRoute exact path="/suy-hao" component={SuyHao} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
