"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import polyglotI18nProvider from "ra-i18n-polyglot";
import frenchMessages from "ra-language-french";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./Layout";
import authProvider from "./authProvider";
import catalog from "./catalog";
import dataProvider from "./dataProvider";
import entries from "./entries";
import exits from "./exits";
import investments from "./investments";
import listRessourceFactory from "./lists";
import metrics from "./metrics";
import offcuts from "./offcuts";
import roles from "./roles";
import theme from "./theme";
import transports from "./transports";
import mails from "./mails";
import users from "./users";
import LoginPage from "./authentication/Login";
import Recover from "./authentication/Recover";
import Reset from "./authentication/Reset";
import Activate from "./authentication/Activate";

frenchMessages.ra.auth.username = "Adresse email";

const i18nProvider = polyglotI18nProvider(() => frenchMessages);

const AdminApp = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <BrowserRouter>
      <Admin
        i18nProvider={i18nProvider}
        loginPage={LoginPage}
        authProvider={authProvider}
        dataProvider={dataProvider}
        layout={AppLayout}
        title="ChutoCollector"
        disableTelemetry
        theme={theme}
      >
        {(permissions: string[]) => (
          <>
            <CustomRoutes noLayout>
              <Route path="/recover" element={<Recover />} />
              <Route path="/reset/:token" element={<Reset />} />
              <Route path="/activate/:token" element={<Activate />} />
            </CustomRoutes>
            <Resource
              {...catalog(permissions)}
              options={{
                label: "Catalogue",
              }}
            />
            <Resource
              {...entries(permissions)}
              options={{
                label: "Entrées",
              }}
            />
            <Resource
              {...exits(permissions)}
              options={{
                label: "Sorties",
              }}
            />
            <Resource
              {...offcuts(permissions)}
              options={{
                label: "Chutes",
                menu: "Inventaire",
              }}
            />
            <Resource
              {...transports(permissions)}
              options={{
                label: "Transports",
                menu: "Inventaire",
              }}
            />
            <Resource
              {...investments(permissions)}
              options={{
                label: "Investissements",
                menu: "Inventaire",
              }}
            />
            <Resource
              {...metrics(permissions)}
              options={{
                label: "Métriques",
                menu: "Administration",
              }}
            />
            <Resource
              {...users(permissions)}
              options={{ label: "Utilisateurs", menu: "Administration" }}
            />
            <Resource
              {...roles(permissions)}
              options={{ label: "Roles", menu: "Administration" }}
            />
            <Resource
              {...mails(permissions)}
              options={{
                label: "Templates de mail",
                menu: "Administration",
              }}
            />
            <Resource
              {...listRessourceFactory("matters")(permissions)}
              options={{ label: "Matières", menu: "Administration" }}
            />
            <Resource
              {...listRessourceFactory("materials")(permissions)}
              options={{
                label: "Matériaux",
                menu: "Administration",
                linkedTo: "matters",
              }}
            />
            <Resource
              {...listRessourceFactory("sizes")(permissions)}
              options={{ label: "Tailles", menu: "Administration" }}
            />
            <Resource
              {...listRessourceFactory("colors")(permissions)}
              options={{ label: "Couleurs", menu: "Administration" }}
            />
            <Resource
              {...listRessourceFactory("qualities")(permissions)}
              options={{
                label: "Qualités",
                menu: "Administration",
                availableTags: ["new", "second-hand"],
              }}
            />
            <Resource
              {...listRessourceFactory("audiences")(permissions)}
              options={{ label: "Publics cibles", menu: "Administration" }}
            />
            <Resource
              {...listRessourceFactory("brandPolicies")(permissions)}
              options={{
                label: "Utilisation marque",
                menu: "Administration",
              }}
            />
            <Resource
              {...listRessourceFactory("transportModes")(permissions)}
              options={{
                label: "Modes de transport",
                menu: "Administration",
              }}
            />
            <Resource
              {...listRessourceFactory("transportReasons")(permissions)}
              options={{
                label: "Raisons de transport",
                menu: "Administration",
              }}
            />
            <Resource
              {...listRessourceFactory("investmentTypes")(permissions)}
              options={{
                label: "Types d'investissement",
                menu: "Administration",
              }}
            />
            <Resource
              {...listRessourceFactory("investmentConditions")(permissions)}
              options={{
                label: "Condition des investissements",
                menu: "Administration",
              }}
            />
          </>
        )}
      </Admin>
    </BrowserRouter>
  </LocalizationProvider>
);

export default AdminApp;
