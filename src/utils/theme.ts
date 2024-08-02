import { createTheme } from '@mui/material/styles';

const inflectGreen = '#1DBF73';
const inflectNavy = '#03091F';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: inflectGreen,
    },
    secondary: {
      main: inflectNavy,
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: inflectNavy,
      secondary: '#03091F',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: inflectNavy,
        },
        icon: {
          color: inflectNavy,
        },
        select: {
          backgroundColor: '#ffffff',
          color: inflectNavy,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingLeft: '18px',
          paddingRight: '30px'
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#001f58',
          '& .MuiTableCell-head': {
            color: '#ffffff',
            fontWeight: 'bold',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: inflectNavy,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: inflectNavy,
        },
        option: {
          color: inflectNavy,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: inflectGreen,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: inflectGreen,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: inflectGreen,
          },
        },
        input: {
          color: inflectNavy,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: inflectNavy,
          '&.Mui-focused': {
            color: inflectGreen,
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: inflectGreen,
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: inflectNavy,
      paper: inflectNavy,
    },
    text: {
      primary: '#ffffff',
      secondary: '#1DB573',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: inflectGreen,
          color: '#ffffff',
        },
        icon: {
          color: '#ffffff',
        },
        select: {
          backgroundColor: inflectNavy,
          color: '#ffffff',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingLeft: '18px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#051A27',
          '& .MuiTableCell-head': {
            color: inflectGreen,
            fontWeight: 'bold',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: inflectNavy,
          color: '#ffffff',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: inflectNavy,
          color: '#ffffff',
        },
        option: {
          color: '#ffffff',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: inflectGreen,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: inflectGreen,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: inflectGreen,
          },
        },
        input: {
          color: '#ffffff',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: inflectGreen,
          '&.Mui-focused': {
            color: inflectGreen,
          },
        },
      },
    },
  },
});
