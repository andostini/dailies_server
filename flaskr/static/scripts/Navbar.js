import React from "react"
import { AppBar, Toolbar, Typography, Button, Grid } from '@material-ui/core';



export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AppBar position="static" color="inherit">
                <Toolbar>
                    <Grid container direction="row" justify="flex-start" alignItems="center">

                        <Grid item xs={6}>
                            <Button href="/viewer" color="inherit">Viewer</Button>
                            <span hidden={window.userName=='viewer'}><Button href="/settings" color="inherit">Settings</Button></span>
                            <Button href="/auth/logout" color="inherit">Logout</Button>
                        </Grid>
                        <Grid item xs={6} >
                            { this.props.children }
                        </Grid>
                    </Grid>

                </Toolbar>
            </AppBar>)
    }
}