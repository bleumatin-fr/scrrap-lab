import * as React from "react";
import { Layout, LayoutProps, useAuthenticated } from "react-admin";
import AppBar from "./AppBar";
import Menu from "./Menu";

const AppLayout = (props: LayoutProps) => {
  useAuthenticated();

  return <Layout {...props} menu={Menu} appBar={AppBar} />;
};

export default AppLayout;
