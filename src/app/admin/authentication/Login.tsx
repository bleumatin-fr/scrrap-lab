import LockIcon from "@mui/icons-material/Lock";
import { Avatar, Button, Card, CardActions, SxProps } from "@mui/material";
import { useCheckAuth } from "ra-core";
import { HtmlHTMLAttributes, useEffect, useRef } from "react";
import { LoginForm } from "react-admin";
import { useNavigate } from "react-router-dom";
import Root from "./Root";
import { Link } from "react-router-dom";
interface LoginProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  sx?: SxProps;
}

const Login = (props: LoginProps) => {
  const { ...rest } = props;
  const checkAuth = useCheckAuth();
  const navigate = useNavigate();

    useEffect(() => {
      checkAuth({}, false)
        .then(() => {
          // already authenticated, redirect to the home page
          navigate("/");
        })
        .catch(() => {
          // not authenticated, stay on the login page
        });
    }, [checkAuth, navigate]);

  return (
    <Root {...rest}>
      <Card
        sx={{
          minWidth: 300,
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
        <LoginForm />
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button component={Link} size="small" to="/recover">
            Mot de passe oublié ?
          </Button>
        </CardActions>
      </Card>
    </Root>
  );
};

export default Login;
