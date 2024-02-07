import LockOpenIcon from "@mui/icons-material/LockOpen";
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
import { useNotify, useUserMenu } from "react-admin";

const ChangePasswordMenuItem = forwardRef((props, ref) => {
  const { onClose } = useUserMenu();
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    try {
      setLoading(true);
      // TODO
      notify("Mot de passe modifié avec succès", {
        type: "success",
      });
    } catch (error) {
      console.log(error);
      notify("Erreur lors de la modification du mot de passe", {
        type: "error",
      });
    }
    onClose();
    setLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Changement de mot de passe
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="currentPassword"
              label="Mot de passe actuel"
              type="password"
              fullWidth
            />
            <TextField
              margin="dense"
              id="newPassword"
              label="Nouveau mot de passe"
              type="password"
              fullWidth
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
          <LockOpenIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Changer mot de passe</ListItemText>
      </MenuItem>
    </>
  );
});

ChangePasswordMenuItem.displayName = "ChangePasswordMenuItem";

export default ChangePasswordMenuItem;
