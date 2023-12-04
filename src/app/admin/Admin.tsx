"use client";

import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import transports from "./transports";
import materials from "./materials";
import machines from "./machines";
import investments from "./investments";
import purchases from "./purchases";
import waste from "./waste";
import Dashboard from "./dashboard";

const dataProvider = jsonServerProvider("http://localhost:3000/api");

const AdminApp = () => (
  <Admin
    dashboard={Dashboard}
    dataProvider={dataProvider}
    title="ChutoCollector"
    disableTelemetry
  >
    <Resource {...transports} />
    <Resource {...materials} />
    <Resource {...machines} />
    <Resource {...investments} />
    <Resource {...purchases} />
    <Resource {...waste} />
  </Admin>
);

export default AdminApp;
