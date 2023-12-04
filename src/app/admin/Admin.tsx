"use client";

import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import transports from "./transports";

const dataProvider = jsonServerProvider("http://localhost:3000/api");

const AdminApp = () => (
  <Admin dataProvider={dataProvider} disableTelemetry>
    <Resource {...transports} />
  </Admin>
);

export default AdminApp;
