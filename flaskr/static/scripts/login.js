
import React from "react";
import ReactDOM from "react-dom";
import Login from "./LoginPage";

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {base} from './styles/themes'

const darkTheme = createTheme(base);

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Login/>
    </ThemeProvider>, document.getElementById("login"));
