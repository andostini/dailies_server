
import React from "react";
import ReactDOM from "react-dom";
import ViewerPage from "./ViewerPage";

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {base} from './styles/themes'

const darkTheme = createTheme(base);

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ViewerPage />
    </ThemeProvider>, document.getElementById("viewer-page"));
