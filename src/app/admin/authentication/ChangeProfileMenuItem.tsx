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
import { useGetIdentity, useNotify, useUserMenu } from "react-admin";

const ChangeProfileMenuItem = forwardRef((props, ref) => {
  const { onClose } = useUserMenu();
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const { data, isLoading } = useGetIdentity();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    try {
      setLoading(true);
      // TODO
      notify("Profil modifié avec succès", {
        type: "success",
      });
    } catch (error) {
      console.log(error);
      notify("Erreur lors de la modification du profil", {
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
          Modification profil
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nom"
              type="text"
              defaultValue={data?.firstName}
              fullWidth
            />
            <TextField
              margin="dense"
              id="name"
              label="Prénom"
              type="text"
              defaultValue={data?.lastName}
              fullWidth
            />
            <TextField
              margin="dense"
              id="email"
              label="Addresser email"
              type="email"
              defaultValue={data?.email}
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
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Modifier profil</ListItemText>
      </MenuItem>
    </>
  );
});

ChangeProfileMenuItem.displayName = "ChangeProfileMenuItem";

export default ChangeProfileMenuItem;
