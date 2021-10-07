
import React from "react";
import ReactDOM from "react-dom";
import SettingsPage from "./SettingsPage";

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {base} from './styles/themes'

const darkTheme = createTheme(base);

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SettingsPage />
    </ThemeProvider>, document.getElementById("settings-page"));
