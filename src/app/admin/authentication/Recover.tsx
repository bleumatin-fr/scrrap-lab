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
import { Link, useNotify } from "react-admin";
import Root from "./Root";

interface ResetProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  sx?: SxProps;
}

const Reset = (props: ResetProps) => {
  const { ...rest } = props;
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/authentication/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: event.target.elements.email.value,
        }),
      });

      if (response.ok) {
        notify("Un email a été envoyé à l'adresse indiquée.", {
          type: "success",
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
              Entrez votre adresse email pour réinitialiser votre mot de passe.
              Vous recevrez un email avec un lien pour réinitialiser votre mot
              de passe.
            </Typography>

            <TextField
              autoFocus
              id="email"
              type="email"
              label={"Adresse email"}
              autoComplete="username"
              fullWidth
              required
              sx={{ mb: 3 }}
            />
            <LoadingButton
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              fullWidth
            >
              Envoyer
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
