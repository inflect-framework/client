import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#1d1d1d",
          color: "#ffffff",
        },
        icon: {
          color: "#ffffff",
        },
        select: {
          backgroundColor: "#1d1d1d",
          color: "#ffffff",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1d1d1d",
          color: "#ffffff",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1d1d1d",
          color: "#ffffff",
        },
        option: {
          color: "#ffffff",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9",
          },
        },
        input: {
          color: "#ffffff",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#90caf9",
          "&.Mui-focused": {
            color: "#90caf9",
          },
        },
      },
    },
  },
});
