import React from "react"
import { AppBar, Toolbar, Typography, Button, Grid } from '@material-ui/core';



export default class Navbar extends React.Component {
    render() {
        return (
            <AppBar position="static" color="inherit">
                <Toolbar>
                    <Grid container direction="row" justify="flex-start" alignItems="center">

                        <Grid item xs={6}>
                            <Button href="/viewer" color="inherit">Viewer</Button>
                            <span hidden={window.userName=='viewer'}><Button href="/viewer/projectmanager" color="inherit">Project Manager</Button></span>
                            <Button href="/logout" color="inherit">Logout</Button>
                        </Grid>
                        <Grid item xs={6} >
                            <Typography variant="subtitle2" align="right">
                                You are logged in as <strong>{window.userName} <br /> {window.project.name}</strong>
                            </Typography>
                        </Grid>
                    </Grid>



                </Toolbar>
            </AppBar>)
    }
}