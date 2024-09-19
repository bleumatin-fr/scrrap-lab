import {
  AppBar as BaseAppBar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
} from "@mui/material";
import {
  AppBarClasses,
  Logout,
  SidebarToggleButton,
  TitlePortal,
  UserMenu,
  usePermissions,
  useRedirect,
  useResourceDefinitions,
} from "react-admin";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import styled from "@emotion/styled";
import Logo from "./Logo";
import ChangePasswordMenuItem from "./authentication/ChangePasswordMenuItem";
import ChangeProfileMenuItem from "./authentication/ChangeProfileMenuItem";

const AppBar = styled(BaseAppBar)``;

const ExitHistoryButton = () => {
  const redirect = useRedirect();
  return (
    <>
      <MenuItem
        onClick={() => {
          redirect("list", "catalog");
        }}
      >
        <ListItemIcon>
          <AutoStoriesIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Catalogue</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          redirect("list", "exits");
        }}
      >
        <ListItemIcon>
          <ListAltIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Historique de mes sorties</ListItemText>
      </MenuItem>
    </>
  );
};

const CustomAppBar = () => {
  const resources = useResourceDefinitions();
  const { permissions } = usePermissions();

  const totalResources = Object.keys(resources)
    .filter((resource) => resources[resource].hasList)
    .filter((resource) => permissions?.includes(`${resource}.menu`)).length;

  const shouldDisplayHistory =
    !permissions?.includes("exits.edit") &&
    permissions?.includes("exits.list-own");

  return (
    <AppBar
      color="primary"
      sx={{
        backgroundColor: "#E6F93B",
        color: "#6A602C",
      }}
    >
      <Toolbar
        disableGutters
        variant="dense"
        sx={{
          width: "100%",
        }}
      >
        <Logo />
        {totalResources > 1 && (
          <>
            <SidebarToggleButton className={AppBarClasses.menuButton} />
            <TitlePortal />
          </>
        )}
        <Box flex="1" />
        <UserMenu>
          {shouldDisplayHistory && (
            <>
              <ExitHistoryButton />
              <Divider />
            </>
          )}
          <ChangeProfileMenuItem />
          <ChangePasswordMenuItem />
          <Logout />
        </UserMenu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
