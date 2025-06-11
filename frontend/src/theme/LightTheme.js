import { createTheme } from '@mui/material';

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e91e63", 
    },
    secondary: {
      main: "#5A20CB", 
    },
    black: {
      main: "#242B2E", 
    },
    background: {
      default: "#F5F5F5", 
      paper: "#FFFFFF",   
      main: "#FFFFFF",   
    },
    text: {
      primary: "#111111", 
      secondary: "#555555", 
      main: "#111111",
    }
  }
});
