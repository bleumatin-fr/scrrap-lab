import { defaultTheme } from "react-admin";

const theme = {
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    MuiTextField: {
      defaultProps: {
        variant: "filled",
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "filled",
        size: "small",
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          verticalAlign: "top",
          fontSize: "1rem",
        },
      },
    },
  },
};

export default theme;
