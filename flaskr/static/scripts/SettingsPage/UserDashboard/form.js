import React from 'react';
import {  Avatar, Modal, Paper, Tooltip, Table, TableRow, TableBody, TableCell, TableContainer, Grid, IconButton, TextField, Typography, FormControl, Select, MenuItem, InputLabel, Input, Slider, FormControlLabel, Switch, Divider, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';



export default class Form extends React.Component {
    constructor(props) {
        super(props);
        const userInfo = this.props.userInfo
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
            billing: userInfo.billing,
            eMail: userInfo.eMail,
            lastLogin: null,
            id: userInfo.id,
            phone:  userInfo.phone,
            userName:  userInfo.userName,
            name:  userInfo.name,
            modalShow: {
                deleteUser: false,
                deleteAvatar: false
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.deleteAvatar = this.deleteAvatar.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
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

    handleModalChange(modal, val) {
        this.setState({
            modalShow: {
                [modal] : val
            }
        })
    }

    deleteAvatar() {
        fetch("../settings/deleteAvatar", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                access_token: localStorage.getItem("access_token"),
                id: this.props.userInfo.id,
                table: "users"
            })
        })
            .then(
                (res) => {
                    if (res.status == 200) {
                        return res.json();
                    }
                    else {
                        window.location.replace('/auth/login')
                    }
                }
            )
            .then(data => {
                this.setState({
                    rspMsgs: data
                })
                if (data.errors.length == 0) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.handleModalChange("deleteAvatar", false)
                    
                }
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.userDashboardForm;
        const formData = new FormData(form);
        let validated = true;

        let errors = {
            password: '',
            file: ''
        }

        const requestData = {
            id: this.props.userInfo.id,
            userName: formData.get('userName'),
            name: formData.get('name'),
            eMail: formData.get('eMail'),
            phone: formData.get('phone'),
            billing: formData.get('billing'),
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


        formData.append("access_token", window.localStorage.getItem("access_token"))

        const uri = "/settings/updateUser"
        if (validated) {
            fetch(uri, {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        rspMsgs: data
                    })
                    if (data.errors.length == 0) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
        }



        this.setState({
            errors: errors
        })

    }

    handleDelete() {
        let requestData = {
            id: this.props.userInfo.id,
            userName: this.props.userInfo.userName,
            access_token: window.localStorage.getItem("access_token")
        }
        fetch('/settings/deleteUser', {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    rspMsgs: data
                })
                if (data.errors.length == 0) {
                    window.location.replace('/auth/logout')
                }
            });
    }

    render() {
        const errors = this.state.errors;
        let state = this.state;
        let rsperrors = this.state.rspMsgs.errors;
        let rspsucceed = this.state.rspMsgs.succeed;

        state.liveStreamPlugin = Boolean(state.liveStreamPlugin);

        return (
            <form method="POST" action='/settings/' onSubmit={this.handleSubmit} id="userDashboardForm" >
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
                            <Typography variant='h3'>Edit your account</Typography>
                            <Typography variant='h4'>Basic Info</Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Username" variant="outlined" name="userName" required value={state.userName} onChange={(e, val) => this.handleChange('userName', val)} />
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

                        <Grid item sm={12}>
                            <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />} >Save</Button>
                            <Button type="button" variant="contained" color="secondary" size="large" startIcon={<DeleteIcon />} onClick={() => this.handleModalChange("deleteUser", true)}>Delete Account</Button>
                        </Grid>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item sm style={{ padding: 4 }}>
                        <Avatar src={"http://localhost:5000/api/images/users/" + state.id + ".png"} style={{ width: 120, height: 120, margin: 'auto' }}>{ (state.id == 'newUser') ? 'New User' : state.userName}</Avatar>
                        <Tooltip title="Delete avatar">
                            <IconButton onClick={() => this.handleModalChange("deleteAvatar", true)} >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>User Id</TableCell>
                                        <TableCell>-</TableCell>
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
                
                
                <Modal
                    open={state.modalShow.deleteUser}
                    onClose={() => this.handleModalChange("deleteUser", false)}
                >
                    <Paper>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Delete Account
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Are you sure you want to delete this user?
                        </Typography>
                    
                        <Button type="button" variant="contained" color="primary" size="large" onClick={() => this.handleModalChange("deleteUser", false)} startIcon={<ClearIcon />} >Cancel</Button>
                        <Button style={{ display: (state.id == 'newUser') ? 'none' : 'inline-flex' }} type="button" variant="contained" color="secondary" size="large" startIcon={<DeleteIcon />} onClick={this.handleDelete}>Delete</Button>
                    </Paper>
                </Modal>

                <Modal
                    open={state.modalShow.deleteAvatar}
                    onClose={() => this.handleModalChange("deleteAvatar", false)}
                >
                    <Paper>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Delete Avatar
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Are you sure you want to delete this users avatar?
                        </Typography>
                        <Button type="button" variant="contained" color="primary" size="large" onClick={() => this.handleModalChange("deleteAvatar", false)} startIcon={<ClearIcon />} >Cancel</Button>
                        <Button type="button" variant="contained" color="secondary" size="large" startIcon={<DeleteIcon />} onClick={this.deleteAvatar}>Delete</Button>
                
                    </Paper>
                </Modal>
            </form>
        );
    }
}