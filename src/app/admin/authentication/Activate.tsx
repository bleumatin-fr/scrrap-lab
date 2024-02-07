import LockIcon from "@mui/icons-material/LockOpen";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, HtmlHTMLAttributes, useState } from "react";
import { Link, useLogin, useNotify } from "react-admin";
import Root from "./Root";
import { useParams } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";

interface ResetProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  sx?: SxProps;
}

const Reset = (props: ResetProps) => {
  const { ...rest } = props;
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const { token } = useParams();
  const login = useLogin();
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (score < 3) {
      notify("Votre mot de passe est trop faible", {
        type: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/authentication/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: event.target.password.value,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        notify("Compte activé avec succès", {
          type: "success",
        });
        await login({
          username: data.user.email,
          password: event.target.password.value,
        });
      } else {
        notify("Une erreur est survenue, veuillez réessayer.", {
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      notify("Une erreur est survenue, veuillez réessayer.", {
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Root {...rest}>
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 400,
          marginTop: "6em",
        }}
      >
        <div
          style={{
            margin: "1em",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Avatar>
            <LockIcon />
          </Avatar>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="body2" align="center" sx={{ mb: 3 }}>
              Activez votre compte en choisissant votre mot de passe
            </Typography>

            <TextField
              autoFocus
              id="password"
              type="password"
              label={"Mot de passe"}
              autoComplete="new-password"
              fullWidth
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrengthBar
              password={password}
              minLength={8}
              shortScoreWord="Trop court"
              scoreWords={["Faible", "Faible", "Moyen", "Bon", "Très bon"]}
              onChangeScore={(score, feedback) => {
                setScore(score);
              }}
            />
            <LoadingButton
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 3 }}
            >
              Activer mon compte
            </LoadingButton>
          </form>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button component={Link} size="small" to="/login">
            Connexion
          </Button>
        </CardActions>
      </Card>
    </Root>
  );
};

export default Reset;
