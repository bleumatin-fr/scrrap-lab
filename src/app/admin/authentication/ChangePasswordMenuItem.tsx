import { HttpError } from "@/app/api/errorHandler";
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
import { useGetIdentity, useNotify, useUpdate, useUserMenu } from "react-admin";
import PasswordStrengthBar from "react-password-strength-bar";

const stopPropagation = {
  onKeyDown: (event: React.KeyboardEvent) => {
    event.stopPropagation();
  },
  onKeyUp: (event: React.KeyboardEvent) => {
    event.stopPropagation();
  },
};

const ChangePasswordMenuItem = forwardRef((props, ref) => {
  const userMenu = useUserMenu();
  const onClose = userMenu?.onClose;
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const { data: user } = useGetIdentity();
  const [score, setScore] = useState(0);
  const [password, setPassword] = useState("");

  const [update] = useUpdate(
    "users",
    {},
    {
      returnPromise: true,
    }
  );

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (score < 3) {
      notify("Votre mot de passe est trop faible", {
        type: "warning",
      });
      return;
    }
    try {
      setLoading(true);
      if (!user) {
        throw new Error("User not found");
      }
      const data = {
        currentPassword: event.target.elements.currentPassword.value,
        newPassword: event.target.elements.newPassword.value,
      };
      const result = await update("users", {
        id: user.id,
        data,
      });

      if (!result) {
        console.error(result);
        notify("Erreur lors de la modification du mot de passe", {
          type: "error",
        });
        return;
      }
      notify("Mot de passe modifié avec succès", {
        type: "success",
      });
      onClose?.();
    } catch (error) {
      if ((error as any).message === "Forbidden") {
        notify("Mot de passe actuel erronné", {
          type: "error",
        });
        return;
      }
      console.error(error);
      notify("Erreur lors de la modification du mot de passe", {
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
              required
              {...stopPropagation}
            />
            <TextField
              margin="dense"
              id="newPassword"
              label="Nouveau mot de passe"
              type="password"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              required
              {...stopPropagation}
            />
            <PasswordStrengthBar
              password={password}
              minLength={8}
              shortScoreWord="Trop court"
              scoreWords={["Faible", "Faible", "Moyen", "Bon", "Très bon"]}
              onChangeScore={(score) => setScore(score)}
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
