import React from "react"
import { AppBar, Toolbar, IconButton, Typography, Button, Grid} from '@material-ui/core';
import { Menu } from '@material-ui/icons'


export default class Navbar extends React.Component {
    render() {
        return (
        <AppBar position="static" color="inherit">
            <Toolbar>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item xs={1}>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu />
                        </IconButton>
                    </Grid>
                    <Grid item xs={5}>
                        
                        <Typography variant="h6" >
                            <font style={{color: "#e91e63"}} >Covideo </font>
                        </Typography>
                        <Typography variant="subtitle1">
                            Dailies & Livestream
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="subtitle2" align="right">
                            You are logged in as <strong>{window.userName} <br /> {window.project.name}</strong>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}  align="right">
                        <Button href="/viewer"color="inherit">Viewer</Button>
                        <Button href="/viewer/projectmanager" color="inherit">Project Manager</Button>
                        <Button href="/logout" color="inherit">Logout</Button>
                    </Grid>
                </Grid>
                
                
                
            </Toolbar>
        </AppBar>)
    }
}