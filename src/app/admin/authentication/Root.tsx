import { styled } from "@mui/material";

const PREFIX = "RaLogin";

const Root = styled("div", {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  height: "1px",
  alignItems: "center",
  justifyContent: "flex-start",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundImage:
    "radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)",
}));

export default Root;
