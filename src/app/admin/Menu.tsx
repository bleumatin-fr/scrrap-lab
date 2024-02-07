import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import DefaultIcon from "@mui/icons-material/ViewList";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { Box, Collapse } from "@mui/material";
import { ReactElement, createElement, useEffect } from "react";
import {
  Menu,
  MenuItemLink,
  useCreatePath,
  useGetResourceLabel,
  useResourceDefinitions,
  useSidebarState,
  useStore,
} from "react-admin";

const menuIcons = {
  Administration: <SettingsIcon />,
  Inventaire: <WarehouseIcon />,
} as Record<string, ReactElement>;

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
  const [open, setOpen] = useStore<string[]>("admin-open", []);
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const resources = useResourceDefinitions();
  const totalResources = Object.keys(resources).filter(
    (resource) => resources[resource].hasList
  ).length;

  // localstorage migration from bool to array of menu id
  useEffect(() => {
    if (!Array.isArray(open)) {
      setOpen([]);
    }
  }, [open, setOpen]);

  useEffect(() => {
    setSidebarOpen(totalResources > 1);
  }, [setSidebarOpen, totalResources]);

  const rootResources = Object.keys(resources)
    .filter((resource) => resources[resource].hasList)
    .filter((resource) => !resources[resource].options?.menu);

  const resourcesByMenu = Object.keys(resources)
    .filter((resource) => resources[resource].hasList)
    .reduce((acc, resource) => {
      if (!resources[resource].options?.menu) return acc;

      return {
        ...acc,
        [resources[resource].options?.menu]: [
          ...(acc[resources[resource].options?.menu] || []),
          resource,
        ],
      };
    }, {} as Record<string, string[]>);

  const toggleMenu = (menu: string) => {
    if (open.includes(menu)) {
      setOpen(open.filter((m) => m !== menu));
    } else {
      setOpen([...open, menu]);
    }
  };

  if (totalResources <= 1) {
    return null;
  }

  return (
    <Menu>
      {rootResources.map((resource) => (
        <Menu.ResourceItem key={resource} name={resource} />
      ))}
      {Object.keys(resourcesByMenu).map((menu) => {
        return [
          <MenuItemLink
            key={`menu-${menu}`}
            primaryText={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Box>{menu}</Box>
                {open.includes(menu) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            }
            leftIcon={menuIcons[menu] || <DefaultIcon />}
            onClick={() => toggleMenu(menu)}
            to={"#"}
          />,
          <Collapse
            key={`menu-${menu}-collapse`}
            in={open.includes(menu)}
            timeout="auto"
            unmountOnExit
            style={{
              paddingLeft: 16,
              fontSize: "12px !important",
            }}
          >
            {resourcesByMenu[menu].map((resource) => (
              <SubMenuItem key={resource} name={resource} />
            ))}
          </Collapse>,
        ];
      })}
    </Menu>
  );
};

export default CustomMenu;
