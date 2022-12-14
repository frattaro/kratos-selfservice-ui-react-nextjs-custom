import { createTheme } from "@mui/material/styles";

const baseOverrides = {
  MuiCssBaseline: {
    styleOverrides: () => `
    body {
      min-width: 412px;
    }
  `
  }
};

// Create a theme instance.
const dark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff"
    },
    secondary: {
      main: "#19857b"
    }
  },
  components: {
    ...baseOverrides
  }
});

const light = createTheme({
  palette: {
    primary: {
      main: "#121212"
    },
    secondary: {
      main: "#19857b"
    }
  },
  components: {
    ...baseOverrides
  }
});

export { light, dark };
