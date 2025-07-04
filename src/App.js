import { Switch, Route } from "react-router-dom";
import Gpon from "./pages/Gpon";
import Main from "./components/layout/Main";
import SignIn from "./pages/Sigin";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Bras from "./pages/Bras";
import Device from "./pages/Device";
import DeviceType from "./pages/DeviceType";
import SuyHao from "./pages/Suyhao";
import PrivateRoute from "./privateRouter";
import PageNotFound from "./pages/PageNotFound";
import Port from "./pages/Port";
import CreateList from "./pages/CreateList";
import HistoryLog from "./pages/HistoryLog";
import User from "./pages/User";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={SignIn} />

        <Main>
          <Switch>
            <PrivateRoute
              exact
              path="/"
              component={Gpon}
              allowedRoles={["admin", "user", "user gpon"]}
            />
            <PrivateRoute
              exact
              path="/gpon"
              component={Gpon}
              allowedRoles={["admin", "user", "user gpon"]}
            />
            <PrivateRoute
              exact
              path="/port"
              component={Port}
              allowedRoles={["admin", "user", "user gpon"]}
            />
            <PrivateRoute
              exact
              path="/bras"
              component={Bras}
              allowedRoles={["admin", "user bras", "user"]}
            />
            <PrivateRoute
              exact
              path="/device"
              component={Device}
              allowedRoles={["admin"]}
            />

            <PrivateRoute
              exact
              path="/device-type"
              component={DeviceType}
              allowedRoles={["admin"]}
            />
            <PrivateRoute
              exact
              path="/suy-hao"
              component={SuyHao}
              allowedRoles={["admin"]}
            />
            <PrivateRoute
              exact
              path="/list"
              component={CreateList}
              allowedRoles={["admin", "user", "user gpon"]}
            />
            <PrivateRoute
              exact
              path="/user"
              component={User}
              allowedRoles={["admin"]}
            />
            <PrivateRoute
              exact
              path="/log"
              component={HistoryLog}
              allowedRoles={["admin"]}
            />

            <Route path="*" component={PageNotFound} />
          </Switch>
        </Main>
      </Switch>
    </div>
  );
}

export default App;
