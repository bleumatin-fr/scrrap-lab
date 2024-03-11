import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { useGetIdentity, useNotify, useUpdate, useUserMenu } from "react-admin";
import { PREFIX } from "../authProvider";

const stopPropagation = {
  onKeyDown: (event: React.KeyboardEvent) => {
    event.stopPropagation();
  },
  onKeyUp: (event: React.KeyboardEvent) => {
    event.stopPropagation();
  },
};

const ChangeProfileMenuItem = forwardRef((props, ref) => {
  const { onClose } = useUserMenu();
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const { data: user, refetch } = useGetIdentity();
  const [update] = useUpdate(
    "users",
    {},
    {
      returnPromise: true,
    }
  );

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      setLoading(true);
      if (!user) {
        throw new Error("User not found");
      }
      const data = {
        lastName: event.target.lastName.value,
        firstName: event.target.firstName.value,
        email: event.target.email.value,
      };

      const result = await update("users", {
        id: user.id,
        data,
      });

      if (!result) {
        console.error(result);
        notify("Erreur lors de la modification du profil", {
          type: "error",
        });
        return;
      }
      localStorage.setItem(`${PREFIX}-auth`, JSON.stringify(result));
      await refetch();
      notify("Profil modifié avec succès", {
        type: "success",
      });
      onClose();
    } catch (error) {
      notify("Erreur lors de la modification du profil", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Modification profil</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="firstName"
              label="Prénom"
              type="text"
              defaultValue={user?.firstName}
              fullWidth
              required
              {...stopPropagation}
            />
            <TextField
              margin="dense"
              id="lastName"
              label="Nom"
              type="text"
              defaultValue={user?.lastName}
              fullWidth
              required
              {...stopPropagation}
            />
            <TextField
              margin="dense"
              id="email"
              label="Addresse email"
              type="email"
              defaultValue={user?.email}
              fullWidth
              required
              {...stopPropagation}
            />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Valider
            </LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
      <MenuItem
        onClick={() => {
          setOpen(true);
        }}
        ref={ref as React.RefObject<HTMLLIElement>}
        {...props}
      >
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Modifier profil</ListItemText>
      </MenuItem>
    </>
  );
});

ChangeProfileMenuItem.displayName = "ChangeProfileMenuItem";

export default ChangeProfileMenuItem;
