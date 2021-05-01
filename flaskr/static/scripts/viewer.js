
import React from "react";
import ReactDOM from "react-dom";
import ViewerPage from "./ViewerPage";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

/*const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#c7c7c7",
        dark: "#c7c7c7"
      },
      background: {
        default: "#202020",
        paper: "#171717"
      }
    }
  });*/


const darkTheme = createMuiTheme({
  
  palette: {
    type: 'dark',
    primary: {
      main: '#64b5f6',
    },
    secondary: {
      main: '#f44336',
    },
    background: {
      default: '#121212',
      paper: '#202020',
    },
  },
  typography: {
    fontSize: 13,
    h1: {
      fontSize: '28pt',
      fontFamily: 'Raleway',
      fontWeight: 500,
    },
    h2:  {
      fontSize: 32,
      fontWeight: 200,
      fontFamily: 'Lato',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 12,
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: 'Raleway',
      fontSize: '14pt',
      fontWeight: 200,
      lineHeight: 1.2,
    },
    button: {
      textTransform: "none"
    },
    fontFamily: 'Source Sans Pro, Arial',
  },
  props: {
    MuiAppBar: {
      color: 'transparent',
    },
  }
});

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ViewerPage />
    </ThemeProvider>, document.getElementById("viewer-page"));
