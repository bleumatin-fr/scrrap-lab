import * as React from "react";
import { Layout, LayoutProps } from "react-admin";
import AppBar from "./AppBar";
import Menu from "./Menu";

const AppLayout = (props: LayoutProps) => (
  <Layout {...props} menu={Menu} appBar={AppBar} />
);

export default AppLayout;
