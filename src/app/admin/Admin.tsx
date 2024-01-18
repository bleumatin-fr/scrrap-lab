"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Admin, Resource, TranslationMessages } from "react-admin";
import { BrowserRouter } from "react-router-dom";
import AppLayout from "./Layout";
import Dashboard from "./dashboard";
import dataProvider from "./dataProvider";
import entries from "./entries";
import exits from "./exits";
import investments from "./investments";
import listRessourceFactory from "./lists";
import offcuts from "./offcuts";
import theme from "./theme";
import transports from "./transports";
import catalog from "./catalog";
import frenchMessages from "ra-language-french";
import polyglotI18nProvider from "ra-i18n-polyglot";


const i18nProvider = polyglotI18nProvider((locale) => frenchMessages);

const AdminApp = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <BrowserRouter>
      <Admin
        i18nProvider={i18nProvider}
        dashboard={Dashboard}
        dataProvider={dataProvider}
        layout={AppLayout}
        title="ChutoCollector"
        disableTelemetry
        theme={theme}
      >
        <Resource
          {...entries}
          options={{
            label: "Entrées",
          }}
        />
        <Resource
          {...exits}
          options={{
            label: "Sorties",
          }}
        />
        <Resource
          {...catalog}
          options={{
            label: "Catalogue",
          }}
        />
        <Resource
          {...offcuts}
          options={{
            label: "Chutes",
            menu: "Inventaire",
          }}
        />
        <Resource
          {...transports}
          options={{
            label: "Transports",
            menu: "Inventaire",
          }}
        />
        <Resource
          {...investments}
          options={{
            label: "Investissements",
            menu: "Inventaire",
          }}
        />
        <Resource
          {...listRessourceFactory("matters")}
          options={{ label: "Matières", menu: "Administration" }}
        />
        <Resource
          {...listRessourceFactory("materials")}
          options={{
            label: "Matériaux",
            menu: "Administration",
            linkedTo: "matters",
          }}
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
          options={{
            label: "Qualités",
            menu: "Administration",
            availableTags: ["new", "second-hand"],
          }}
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
          options={{
            label: "Condition des investissements",
            menu: "Administration",
          }}
        />
      </Admin>
    </BrowserRouter>
  </LocalizationProvider>
);

export default AdminApp;
