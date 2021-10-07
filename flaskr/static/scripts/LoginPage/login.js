import React from 'react';
import { Link, Paper, Grid,Avatar, Container, Button , Typography, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import styles from '../styles/login.module.css'


export default class Ulogin extends React.Component {
    constructor() {
        super()
        this.state = {
            Alert: false,
            AlertMsg: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.loginForm;
        const formData = new FormData(form);

        fetch("/auth/login", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.error);
            if (data.error == null) {
                this.setState({
                    Alert: false,
                    AlertMsg: ""
                })
                localStorage.setItem("access_token", data["access_token"]);
                window.location.replace("/settings/");

            }
            else {
                this.setState({
                    Alert: true,
                    AlertMsg: data["error"]
                })
            }

        })

    }

    render() {
        const state = this.state;
        return(
            <Container component="main" maxWidth="xs" style={{minHeight: '100vh'}}>
                <Grid
                    container
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        textAlign: 'center'
                    }}
                >
                    <Grid item >
                        <img src="/static/img/twoLine-w.png" className={styles.logo} />
                        <Paper style={{padding: '20px'}}>
                            <Avatar style={{margin: 'auto'}}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5" style={{margin: '10px'}}>
                                Sign in
                            </Typography>
                            <form method="POST" onSubmit={this.handleSubmit} id="loginForm" >
                                <TextField variant="standard" required fullWidth id="userName" label="Username" name="userName" autoComplete="userName" />
                                <TextField variant="standard" required fullWidth id="password" label="Password" name="password" autoComplete="password" type="password" />
                                <Button type="submit" fullWidth variant="contained" color="secondary" style={{marginTop: '20px'}}>Sign In</Button>
                            </form>
                            <Alert severity="error" style={{display: state.Alert == true ? 'block' : 'none'}}>{state.AlertMsg}</Alert>
                        </Paper>
                        <Typography variant="body2" component="p" className={styles.caption}>
                            This login is for registered users only. <Link href="/auth/signup">Sign up</Link> if you want to create your own projects.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        )
    }

}