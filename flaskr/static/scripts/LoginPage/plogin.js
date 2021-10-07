import React from 'react'; 
import { Paper, Grid, Avatar, Container, Button , Typography, TextField, Link  } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import styles from '../styles/login.module.css'


export default class Plogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Alert: false,
            AlertMsg: "",
            project: {
                name: "",
                id: ""
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        fetch("/api/getProjectInfo/"+this.props.projectId, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                access_token: '',
                project_token: ''
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error == null) {
                this.setState({
                    project: data.project
                })
                
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.loginForm;
        const formData = new FormData(form);
        let project_token = null
        if (localStorage.project_token) {
            project_token = localStorage.project_token;
        }

        fetch("/auth/login/"+this.props.projectId, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                password: formData.get("password"),
                project_token: project_token
            })  
        })
        .then(response => response.json())
        .then(data => {
            if (data.error == null) {
                this.setState({
                    Alert: false,
                    AlertMsg: ""
                })
                localStorage.setItem("project_token", data["project_token"]);
                window.location.replace("/viewer/" + this.props.projectId);

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
            <Container component="main" maxWidth="xs" style={{minHeight: '100vh'}}s>

                <Grid
                    container
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        textAlign: 'center'
                    }}
                >
                    <Grid item>
                        <img src={"/api/images/projects/" + state.project.id + ".png"} className={styles.logo} onError={(e) => e.target.src = '/static/img/twoLine-w.png'} />
                        <Paper style={{padding: '20px'}}>
                            <Avatar style={{margin: 'auto'}}>
                                <LockOutlinedIcon />
                            </Avatar>

                            <Typography component="h2" variant="subtitle2" style={{margin: '10px'}}>
                                Sign in to
                            </Typography>
                            <Typography component="h1" variant="h5" style={{margin: '10px'}}>
                                {state.project.name}
                            </Typography>
                            <form method="POST" onSubmit={this.handleSubmit} id="loginForm" >
                                <TextField variant="standard" required fullWidth id="password" label="Password" name="password" autoComplete="password" type="password" />
                                <Button type="submit" fullWidth variant="contained" color="secondary" style={{marginTop: '20px'}}>Sign In</Button>
                            </form>
                            <Alert severity="error" style={{display: state.Alert == true ? 'block' : 'none'}}>{state.AlertMsg}</Alert>
                        </Paper>
                        <Typography variant="body2" component="p" className={styles.caption}>
                            This login is for a single project only. <Link href="/auth/login">Sign in</Link> if you have an account or <Link href="/auth/signup">sign up</Link> if you want to create your own projects.
                        </Typography>
                    </Grid>
                </Grid>


                </Container>
        )
    }

}