
import React from "react";
import ReactDOM from "react-dom";
import PlayerPage from "./PlayerPage";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
    }
  });

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <PlayerPage />
    </ThemeProvider>, document.getElementById("player-page"));
