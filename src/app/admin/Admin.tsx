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
            {permissions?.includes("entries.list") && (
              <Resource
                {...entries(permissions)}
                options={{
                  label: "Entrées",
                }}
              />
            )}
            {permissions?.includes("exits.list") && (
              <Resource
                {...exits(permissions)}
                options={{
                  label: "Sorties",
                }}
              />
            )}
            {permissions?.includes("catalog.list") && (
              <Resource
                {...catalog(permissions)}
                options={{
                  label: "Catalogue",
                }}
              />
            )}
            {permissions?.includes("offcuts.list") && (
              <Resource
                {...offcuts(permissions)}
                options={{
                  label: "Chutes",
                  menu: "Inventaire",
                }}
              />
            )}
            {permissions?.includes("transports.list") && (
              <Resource
                {...transports(permissions)}
                options={{
                  label: "Transports",
                  menu: "Inventaire",
                }}
              />
            )}
            {permissions?.includes("investments.list") && (
              <Resource
                {...investments(permissions)}
                options={{
                  label: "Investissements",
                  menu: "Inventaire",
                }}
              />
            )}
            {permissions?.includes("metrics.list") && (
              <Resource
                {...metrics(permissions)}
                options={{
                  label: "Métriques",
                  menu: "Administration",
                }}
              />
            )}
            {permissions?.includes("users.list") && (
              <Resource
                {...users(permissions)}
                options={{ label: "Utilisateurs", menu: "Administration" }}
              />
            )}
            {permissions?.includes("roles.list") && (
              <Resource
                {...roles(permissions)}
                options={{ label: "Roles", menu: "Administration" }}
              />
            )}
            {permissions?.includes("mails.list") && (
              <Resource
                {...mails(permissions)}
                options={{
                  label: "Templates de mail",
                  menu: "Administration",
                }}
              />
            )}
            {permissions?.includes("matters.edit") && (
              <Resource
                {...listRessourceFactory("matters")(permissions)}
                options={{ label: "Matières", menu: "Administration" }}
              />
            )}
            {permissions?.includes("materials.edit") && (
              <Resource
                {...listRessourceFactory("materials")(permissions)}
                options={{
                  label: "Matériaux",
                  menu: "Administration",
                  linkedTo: "matters",
                }}
              />
            )}
            {permissions?.includes("sizes.edit") && (
              <Resource
                {...listRessourceFactory("sizes")(permissions)}
                options={{ label: "Tailles", menu: "Administration" }}
              />
            )}
            {permissions?.includes("colors.edit") && (
              <Resource
                {...listRessourceFactory("colors")(permissions)}
                options={{ label: "Couleurs", menu: "Administration" }}
              />
            )}
            {permissions?.includes("qualities.edit") && (
              <Resource
                {...listRessourceFactory("qualities")(permissions)}
                options={{
                  label: "Qualités",
                  menu: "Administration",
                  availableTags: ["new", "second-hand"],
                }}
              />
            )}
            {permissions?.includes("audiences.edit") && (
              <Resource
                {...listRessourceFactory("audiences")(permissions)}
                options={{ label: "Publics cibles", menu: "Administration" }}
              />
            )}
            {permissions?.includes("brandPolicies.edit") && (
              <Resource
                {...listRessourceFactory("brandPolicies")(permissions)}
                options={{
                  label: "Utilisation marque",
                  menu: "Administration",
                }}
              />
            )}
            {permissions?.includes("transportModes.edit") && (
              <Resource
                {...listRessourceFactory("transportModes")(permissions)}
                options={{
                  label: "Modes de transport",
                  menu: "Administration",
                }}
              />
            )}
            {permissions?.includes("transportReasons.edit") && (
              <Resource
                {...listRessourceFactory("transportReasons")(permissions)}
                options={{
                  label: "Raisons de transport",
                  menu: "Administration",
                }}
              />
            )}
            {permissions?.includes("investmentTypes.edit") && (
              <Resource
                {...listRessourceFactory("investmentTypes")(permissions)}
                options={{
                  label: "Types d'investissement",
                  menu: "Administration",
                }}
              />
            )}
            {permissions?.includes("investmentConditions.edit") && (
              <Resource
                {...listRessourceFactory("investmentConditions")(permissions)}
                options={{
                  label: "Condition des investissements",
                  menu: "Administration",
                }}
              />
            )}
          </>
        )}
      </Admin>
    </BrowserRouter>
  </LocalizationProvider>
);

export default AdminApp;
