"use client";

import { Admin, Resource } from "react-admin";
import transports from "./transports";
import offcuts from "./offcuts";
import Dashboard from "./dashboard";
import theme from "./theme";
import listRessourceFactory from "./lists";
import AppLayout from "./Layout";
import dataProvider from "./dataProvider";
import investments from "./investments";
import entries from "./entries";


const AdminApp = () => (
  <Admin
    dashboard={Dashboard}
    dataProvider={dataProvider}
    layout={AppLayout}
    title="ChutoCollector"
    disableTelemetry
    theme={theme}
  >
    <Resource {...entries} options={{
      label: "Entrées",
    }}/>
    <Resource {...offcuts} options={{
      label: "Chutes",
    }}/>
    <Resource {...transports} />
    <Resource {...investments} options={{
      label: "Investissements",
    }}/>
    <Resource
      {...listRessourceFactory("matters")}
      options={{ label: "Matières", menu: "Administration" }}
    />
    <Resource
      {...listRessourceFactory("materials")}
      options={{ label: "Matériaux", menu: "Administration", linkedTo: "matters" }}
    />
    <Resource
      {...listRessourceFactory("sizes")}
      options={{ label: "Tailles", menu: "Administration" }}
    />
    <Resource
      {...listRessourceFactory("colors")}
      options={{ label: "Couleurs", menu: "Administration" }}
    />
    <Resource
      {...listRessourceFactory("qualities")}
      options={{ label: "Qualités", menu: "Administration", availableTags: ["new", "second-hand"] }}
    />
    <Resource
      {...listRessourceFactory("audiences")}
      options={{ label: "Publics cibles", menu: "Administration" }}
    />
    <Resource
      {...listRessourceFactory("brandPolicies")}
      options={{ label: "Utilisation marque", menu: "Administration" }}
    />
    <Resource
      {...listRessourceFactory("transportModes")}
      options={{ label: "Modes de transport", menu: "Administration" }}
    />
    <Resource
      {...listRessourceFactory("transportReasons")}
      options={{ label: "Raisons de transport", menu: "Administration" }}
    />
    <Resource
      {...listRessourceFactory("investmentTypes")}
      options={{ label: "Types d'investissement", menu: "Administration" }}
    />
    <Resource
      {...listRessourceFactory("investmentConditions")}
      options={{ label: "Condition des investissements", menu: "Administration" }}
    />
  </Admin>
);

export default AdminApp;
