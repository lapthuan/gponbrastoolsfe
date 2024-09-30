import { Switch, Route } from "react-router-dom";
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
import PageNotFound from "./pages/PageNotFound";
import Port from "./pages/Port";
import CreateList from "./pages/CreateList";
import Register from "./pages/Register";
import User from "./pages/User";

function App() {
  return (

    <div className="App">

      <Switch>
        <Route exact path="/login" component={SignIn} />


        <Main>

          <Switch>
            <PrivateRoute exact path="/" component={Gpon} allowedRoles={["admin", "user", "user gpon"]} />
            <PrivateRoute exact path="/gpon" component={Gpon} allowedRoles={["admin", "user", "user gpon"]} />
            <PrivateRoute exact path="/port" component={Port} allowedRoles={["admin", "user", "user gpon"]} />
            <PrivateRoute exact path="/bras" component={Bras} allowedRoles={["admin", "user bras", "user"]} />
            <PrivateRoute exact path="/device" component={Device} allowedRoles={["admin"]} />
            <PrivateRoute exact path="/ipaddress" component={IpAddress} allowedRoles={["admin"]} />
            <PrivateRoute exact path="/vlanims" component={VlanIms} allowedRoles={["admin"]} />
            <PrivateRoute exact path="/vlanmytv" component={VlanMyTV} allowedRoles={["admin"]} />
            <PrivateRoute exact path="/vlannet" component={VlanNet} allowedRoles={["admin"]} />
            <PrivateRoute exact path="/suy-hao" component={SuyHao} allowedRoles={["admin"]} />
            <PrivateRoute exact path="/list" component={CreateList} allowedRoles={["admin", "user", "user gpon"]} />
            <PrivateRoute exact path="/user" component={User} allowedRoles={["admin"]} />

            <Route path="*" component={PageNotFound} />
          </Switch>
        </Main>
      </Switch>
    </div>
  );
}

export default App;
