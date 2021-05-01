
import React from "react";
import ReactDOM from "react-dom";
import SettingsPage from "./SettingsPage";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


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
      paddingBottom: 15,
    },
    h3: {
      fontSize: 20,
      fontWeight: 600,
      paddingBottom: 5,
    },
    h4: {
      fontSize: 14,
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
    }
  }
});

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SettingsPage />
    </ThemeProvider>, document.getElementById("settings-page"));
