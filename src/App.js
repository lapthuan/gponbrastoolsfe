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
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import Main from "./components/layout/Main";
import SignIn from "./pages/SignIn";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Bras from "./pages/Bras";
import PrivateRoute from "./privateRouter";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/sign-in" component={SignIn} />
        <Main>
          <PrivateRoute exact path="/" component={Gpon} />
          <PrivateRoute exact path="/gpon" component={Gpon} />
          <PrivateRoute exact path="/bras" component={Bras} />
          <PrivateRoute exact path="/billing" component={Billing} />
          <PrivateRoute exact path="/rtl" component={Rtl} />
          <PrivateRoute exact path="/profile" component={Profile} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
