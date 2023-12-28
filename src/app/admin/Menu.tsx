import {
  Menu,
  MenuItemLink,
  useCreatePath,
  useGetResourceLabel,
  useLocaleState,
  useResourceDefinitions,
  useStore,
} from "react-admin";
import LabelIcon from "@mui/icons-material/Label";
import transports from "./transports";
import offcuts from "./offcuts";
import { Box, Collapse, styled } from "@material-ui/core";
import { createElement, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DefaultIcon from "@mui/icons-material/ViewList";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const SubMenuItem = ({ name }: { name: string }) => {
  const resources = useResourceDefinitions();
  const getResourceLabel = useGetResourceLabel();
  const createPath = useCreatePath();
  if (!resources || !resources[name]) return null;
  return (
    <MenuItemLink
      to={createPath({
        resource: name,
        type: "list",
      })}
      sx={{
        fontSize: 14,
        ".MuiListItemIcon-root": {
          minWidth: 24,
        },
      }}
      state={{ _scrollToTop: true }}
      primaryText={
        <div style={{ lineHeight: 1 }}>{getResourceLabel(name, 2)}</div>
      }
      leftIcon={
        resources[name].icon ? (
          createElement(resources[name].icon, {
            fontSize: "small",
          })
        ) : (
          <DefaultIcon sx={{ fontSize: 14 }} />
        )
      }
    />
  );
};

const CustomMenu = () => {
  const [open, setOpen] = useStore("admin-open", false);
  const resources = useResourceDefinitions();

  const rootResources = Object.keys(resources).filter(
    (resource) => !resources[resource].options?.menu
  );

  const adminResources = Object.keys(resources).filter(
    (resource) => resources[resource].options?.menu === "Administration"
  );

  return (
    <Menu>
      <Menu.DashboardItem />
      {rootResources.map((resource) => (
        <Menu.ResourceItem key={resource} name={resource} />
      ))}
      <MenuItemLink
        primaryText={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box>Administration</Box>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
        }
        leftIcon={<SettingsIcon />}
        onClick={() => setOpen(!open)}
        to={"#"}
      />
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        style={{
          paddingLeft: 16,
          fontSize: "12px !important",
        }}
      >
        {adminResources.map((resource) => (
          <SubMenuItem key={resource} name={resource} />
        ))}
      </Collapse>
    </Menu>
  );
};

export default CustomMenu;
