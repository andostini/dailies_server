import React from 'react';
import { useHistory } from "react-router-dom";
import { Avatar, Container, Button , Typography, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


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
            <Container component="main" maxWidth="xs" style={{textAlign: "center"}}>
                <Avatar>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form method="POST" onSubmit={this.handleSubmit} id="loginForm" >
                    <TextField variant="outlined" required fullWidth id="userName" label="Username" name="userName" autoComplete="userName" />
                    <TextField variant="outlined" required fullWidth id="password" label="Password" name="password" autoComplete="password" type="password" />
                    <Button type="submit" fullWidth variant="contained" color="primary">Sign In</Button>
                </form>
                <Alert severity="error" style={{display: state.Alert == true ? 'block' : 'none'}}>{state.AlertMsg}</Alert>
            </Container>
        )
    }

}