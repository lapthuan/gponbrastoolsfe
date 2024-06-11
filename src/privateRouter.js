import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import ServiceIp from "./service/ServiceIp";

const cookies = new Cookies();

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLogin = cookies.get("token");

  useEffect(() => {
    const checkToken = async () => {
      try {
        await ServiceIp.getAllIp();
      } catch (error) {
        // Lỗi sẽ được xử lý bởi interceptor
      }
    };

    if (isLogin) {
      checkToken();
    }
  }, [isLogin]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin ? <Component {...props} /> : <Redirect to="/sign-in" />
      }
    />
  );
};

export default PrivateRoute;
