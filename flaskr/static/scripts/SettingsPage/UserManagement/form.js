import React from 'react';
import {  Avatar, Table, TableRow, TableBody, TableCell, TableContainer, Grid, FormGroup, TextField, Typography, FormControl, Select, MenuItem, InputLabel, Input, Slider, FormControlLabel, Switch, Divider, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';



export default class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            errors: {
                password: '',
                file: '',
            },
            rspMsgs: {
                errors: [],
                succeed: []
            },
            avatar: null,
            billing: "",
            eMail: "",
            expirationDate: "",
            id: 'newUser',
            lastLogin: null,
            liveStreamPlugin: false,
            maxGB: 5,
            phone: '',
            maxProjectNumber: 5,
            name: "",
            userGroup: 5,
            userName: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange(e, val) {
        this.setState({
            [e]: val
        })
    }

    handleAvatarChange(e, val) {
        this.setState({
            avatar: e.target.files[0]
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) { //Will fire if user is selected from user table
            if (this.props.user == 'newUser') {
                this.setState({
                    avatar: "",
                    billing: "",
                    eMail: "",
                    expirationDate: "",
                    id: 'newUser',
                    lastLogin: null,
                    liveStreamPlugin: false,
                    maxGB: 5,
                    phone: '',
                    maxProjectNumber: 5,
                    name: "",
                    userGroup: 5,
                    userName: ""
                })
            }
            else {
            this.setState(this.props.user)
            }

        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.newUserForm;
        const formData = new FormData(form);
        let validated = true;

        let errors = {
            password: '',
            file: ''
        }

        const requestData = {
            id: formData.get('id'),
            userName: formData.get('userName'),
            userGroup: formData.get('userGroup'),
            name: formData.get('name'),
            eMail: formData.get('eMail'),
            phone: formData.get('phone'),
            billing: formData.get('billing'),
            maxGB: formData.get('maxGB'),
            maxProjectNumber: formData.get('maxProjectNumber'),
            expirationDate: formData.get('expirationDate'),
            liveStreamPlugin: formData.has('liveStreamPlugin'),
            avatar: this.state.avatar
        }

        if (formData.get('password') != '') {
            if (formData.get('password') != formData.get('passwordrepeat')) {
                validated = false;
                errors.password = "The passwords you entered don't match";
            }
            else {
                requestData.password = formData.get('password')
            }
        }
        else {
            formData.delete("password")
            formData.delete("passwordrepeat")
        }

        const avatar = formData.get("avatar")
        if (avatar.name != '') {
            if (avatar.type == 'image/png') {
                requestData.avatar = avatar;
            }
            else {
                validated = false;
                errors.file = 'Avatar image must be .png file'
            }
            if (avatar.size > 3000000) {
                validated = false;
                errors.file = 'Avatar exceeds file size of 3MB'
            }
        }

        const uri = (requestData.id == 'newUser') ? "/settings/newUser" : "/settings/updateUser"
        if (validated) {
            fetch(uri, {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    this.props.updateUserTable()
                    this.setState({
                        rspMsgs: data
                    })
                });
        }



        this.setState({
            errors: errors
        })

    }

    handleDelete() {
        let requestData = {
            id: this.state.id,
            userName: this.state.userName
        }
        fetch('/settings/deleteUser', {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                this.props.updateUserTable()
                this.props.changeUserInForm('newUser')
                this.setState({
                    rspMsgs: data
                })
            });
    }

    render() {
        const errors = this.state.errors;
        let state = this.state;
        let rsperrors = this.state.rspMsgs.errors;
        let rspsucceed = this.state.rspMsgs.succeed;


        state.liveStreamPlugin = Boolean(state.liveStreamPlugin);

        return (
            <form method="POST" action='/settings/' onSubmit={this.handleSubmit} id="newUserForm" >
                <input type="hidden" name="id" value={state.id} />
                <Grid container spacing={2} style={{ paddingTop: '30px' }}>
                    <Grid item xs={12}>
                        {rsperrors.map((error, i) =>
                            <Alert variant="filled" severity="error" key={'error-' + i}>{error}</Alert>
                        )}
                        {rspsucceed.map((succeed, i) =>
                            <Alert variant="filled" severity="success" key={'success-' + i}>{succeed}</Alert>
                        )}
                    </Grid>
                    <Grid item container sm={9} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h3'>{(state.id == 'newUser') ? 'Create new user' : 'Editing ' + state.userName}</Typography>
                            <Typography variant='h4'>Basic Info</Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Username" variant="outlined" name="userName" required value={state.userName} onChange={(e, val) => this.handleChange('userName', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <FormControl variant='outlined' fullWidth required>
                                <InputLabel>User Group</InputLabel>
                                <Select name="userGroup" label='User Group' value={state.userGroup} onChange={(e, val) => this.handleChange('userGroup', val.props.value)}>
                                    <MenuItem value={0} >System Admin</MenuItem>
                                    <MenuItem value={5} >Project Manager</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Email" variant="outlined" name="eMail" type="mail" required value={state.eMail} onChange={(e, val) => this.handleChange('eMail', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Phone" variant="outlined" name="phone" required value={state.phone}  onChange={(e, val) => this.handleChange('phone', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Name" variant="outlined" name="name" required value={state.name} onChange={(e, val) => this.handleChange('name', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Billing Adress" variant="outlined" name="billing" multiline rows={4} rowsMax={6} value={state.billing} onChange={(e, val) => this.handleChange('billing', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <FormControl variant='outlined' fullWidth error={errors.file != ''} >
                                <Input accept=".png" type="file" name="avatar" onChange={this.handleAvatarChange} ></Input>
                                <Typography color="error">{errors.file}</Typography>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant='h4'>Security</Typography>
                        </Grid>
                        <Grid item sm={6}>

                            <TextField required={(state.id == 'newUser') ? true : false} fullWidth helperText={errors.password} error={errors.password != ''} id="outlined-basic" label="New Password" variant="outlined" type="password" name="password" />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField required={(state.id == 'newUser') ? true : false} fullWidth id="outlined-basic" label="Password repeat" variant="outlined" type="password" name="passwordrepeat" />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant='h4'>Plan</Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <Typography id="discrete-slider" name="maxStorage" gutterBottom>Available Storage</Typography>
                            <Slider
                                value={state.maxGB}
                                step={1}
                                marks
                                min={1}
                                max={30}
                                name="maxGB"
                                valueLabelDisplay="on"
                                onChange={(e, val) => this.handleChange('maxGB', val)}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <Typography id="discrete-slider" name="maxProjects" gutterBottom>Max. number of projects</Typography>
                            <Slider
                                value={state.maxProjectNumber}
                                step={1}
                                marks
                                min={1}
                                max={30}
                                name="maxProjectNumber"
                                valueLabelDisplay="on"
                                onChange={(e, val) => this.handleChange('maxProjectNumber', val)}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField 
                                fullWidth 
                                label="Expiration Date" 
                                variant="outlined" 
                                type="date" 
                                name="expirationDate" 
                                value={state.expirationDate} 
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(e, val) => this.handleChange('expirationDate', val)}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <FormControlLabel
                                value="true"
                                control={<Switch
                                    color="primary"
                                    checked={state.liveStreamPlugin}
                                    onChange={(e, val) => this.handleChange('liveStreamPlugin', val)}
                                />}
                                label="Live Streaming Plugin"
                                labelPlacement="top"
                                name="liveStreamPlugin"
                            />
                        </Grid>

                        <Grid item sm={12}>
                            <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />} >Save</Button>
                            <Button style={{ display: (state.id == 'newUser') ? 'none' : 'inline-flex' }} type="button" variant="contained" color="secondary" size="large" startIcon={<DeleteIcon />} onClick={this.handleDelete}>Delete</Button>
                        </Grid>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item sm style={{ padding: 4 }}>
                        <Avatar src={"http://localhost:5000/api/images/" + state.id + ".png"} style={{ width: 120, height: 120, margin: 'auto' }}>New User</Avatar>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>User Id</TableCell>
                                        <TableCell>New User</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Last Login</TableCell>
                                        <TableCell>-</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Creation Date</TableCell>
                                        <TableCell>-</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Number of projects</TableCell>
                                        <TableCell>-</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Data Usage</TableCell>
                                        <TableCell>-</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Grid>
                </Grid>
            </form>
        );
    }
}