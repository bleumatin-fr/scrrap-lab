import { AppBar as BaseAppBar, Box, Toolbar } from "@mui/material";
import {
  AppBarClasses,
  Logout,
  SidebarToggleButton,
  TitlePortal,
  UserMenu,
  useResourceDefinitions,
} from "react-admin";

import Logo from "./Logo";
import styled from "@emotion/styled";
import ChangePasswordMenuItem from "./authentication/ChangePasswordMenuItem";
import ChangeProfileMenuItem from "./authentication/ChangeProfileMenuItem";
import { useEffect } from "react";

const AppBar = styled(BaseAppBar)``;

const CustomAppBar = () => {
  const resources = useResourceDefinitions();
  const totalResources = Object.keys(resources).filter(
    (resource) => resources[resource].hasList
  ).length;

  return (
    <AppBar color="primary">
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
          <ChangeProfileMenuItem />
          <ChangePasswordMenuItem />
          <Logout />
        </UserMenu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
