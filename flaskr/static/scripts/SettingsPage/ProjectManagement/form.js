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
            id: 'newProject',
            name: '',
            password: '',
            owner: '',
            mapWaste_clip: '',
            mapNormal_take: '',
            mapGood_take: '',
            mapFav_take: '',
            cameraA: '',
            cameraB: '',
            cameraC: '',
            cameraD: '',
            libraryPageVisible: 1,
            livePageVisible: 1

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
        if (prevProps.project !== this.props.project) { //Will fire if project is selected from project table
            if (this.props.project == 'newProject') {
                this.setState({
                    avatar: null,
                    id: 'newProject',
                    name: '',
                    password: '',
                    owner: '',
                    mapWaste_clip: '',
                    mapNormal_take: '',
                    mapGood_take: '',
                    mapFav_take: '',
                    cameraA: '',
                    cameraB: '',
                    cameraC: '',
                    cameraD: '',
                    libraryPageVisible: 1,
                    livePageVisible: 1
                })
            }
            else {
            this.setState(this.props.project)
            }

        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.newProjectForm;
        const formData = new FormData(form);
        let validated = true;

        let errors = {
            password: '',
            file: ''
        }

        const requestData = {
            id: formData.get('id'),
            name: formData.get('name'),
            owner: formData.get('owner'),
            mapWaste_clip: formData.get('mapWaste_clip'),
            mapNormal_take: formData.get('mapNormal_take'),
            mapGood_take: formData.get(' mapGood_take'),
            mapFav_take: formData.get('mapFav_take'),
            cameraA: formData.get('cameraA'),
            cameraB: formData.get('cameraB'),
            cameraC: formData.get('cameraC'),
            cameraD: formData.get('cameraD'),
            libraryPageVisible: formData.has('libraryPageVisible'),
            livePageVisible: formData.has('livePageVisible'),
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

        const uri = (requestData.id == 'newProject') ? "/settings/newProject" : "/settings/updateProject"
        if (validated) {
            fetch(uri, {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    this.props.updateProjectTable()
                    this.setState({
                        rspMsgs: data
                    })
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
        }



        this.setState({
            errors: errors
        })

    }

    handleDelete() {
        let requestData = {
            id: this.state.id,
            name: this.state.name
        }
        fetch('/settings/deleteProject', {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                this.props.updateProjectTable()
                this.props.changeProjectInForm('','newProject')
                this.setState({
                    rspMsgs: data
                })
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
    }

    render() {
        const errors = this.state.errors;
        let state = this.state;
        let rsperrors = this.state.rspMsgs.errors;
        let rspsucceed = this.state.rspMsgs.succeed;


        state.livePageVisible = Boolean(state.livePageVisible);
        state.libraryPageVisible = Boolean(state.libraryPageVisible);

        return (
            <form method="POST" action='/settings/' onSubmit={this.handleSubmit} id="newProjectForm" >
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
                            <Typography variant='h3'>{(state.id == 'newProject') ? 'Create new project' : 'Editing ' + state.name}</Typography>
                            <Typography variant='h4'>Basic Info</Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Project Name" variant="outlined" name="name" required value={state.name} onChange={(e, val) => this.handleChange('name', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <Input type="number" fullWidth id="outlined-basic" label="Owner (ID)" variant="outlined" name="owner" required value={state.owner} onChange={(e, val) => this.handleChange('owner', val)} />
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
                            <TextField required={(state.id == 'newProject') ? true : false} fullWidth helperText={errors.password} error={errors.password != ''} id="outlined-basic" label="New Password" variant="outlined" type="password" name="password" />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField required={(state.id == 'newProject') ? true : false} fullWidth id="outlined-basic" label="Password repeat" variant="outlined" type="password" name="passwordrepeat" />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant='h4'>Label Mapping</Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="waste_clip" variant="outlined" name="mapWaste_clip" value={state.mapWaste_clip} onChange={(e, val) => this.handleChange('mapWaste_clip', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="normal_take" variant="outlined" name="mapNormal_take" value={state.mapNormal_take} onChange={(e, val) => this.handleChange('mapNormal_take', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="good_take" variant="outlined" name="mapGood_take" value={state.mapGood_take} onChange={(e, val) => this.handleChange('mapGood_take', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="fav_take" variant="outlined" name="mapFav_take" value={state.mapFav_take} onChange={(e, val) => this.handleChange('mapFav_take', val)} />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant='h4'>Live Stream Settings</Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Camera A" variant="outlined" name="cameraA" value={state.cameraA} onChange={(e, val) => this.handleChange('cameraA', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Camera B" variant="outlined" name="cameraB" value={state.cameraB} onChange={(e, val) => this.handleChange('cameraB', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Camera C" variant="outlined" name="cameraC" value={state.cameraC} onChange={(e, val) => this.handleChange('cameraC', val)} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField fullWidth id="outlined-basic" label="Camera D" variant="outlined" name="cameraD" value={state.cameraD} onChange={(e, val) => this.handleChange('cameraD', val)} />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant='h4'>Viewer Settings</Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <FormControlLabel
                                value="true"
                                control={<Switch
                                    color="primary"
                                    checked={state.livePageVisible}
                                    onChange={(e, val) => this.handleChange('livePageVisible', val)}
                                />}
                                label="Show Live Page"
                                labelPlacement="top"
                                name="livePageVisible"
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <FormControlLabel
                                value="true"
                                control={<Switch
                                    color="primary"
                                    checked={state.libraryPageVisible}
                                    onChange={(e, val) => this.handleChange('libraryPageVisible', val)}
                                />}
                                label="Show Library Page"
                                labelPlacement="top"
                                name="libraryPageVisible"
                            />
                        </Grid>

                        <Grid item sm={12}>
                            <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />} >Save</Button>
                            <Button style={{ display: (state.id == 'newProject') ? 'none' : 'inline-flex' }} type="button" variant="contained" color="secondary" size="large" startIcon={<DeleteIcon />} onClick={this.handleDelete}>Delete</Button>
                        </Grid>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item sm style={{ padding: 4 }}>
                        <Avatar src={"http://localhost:5000/api/images/projects/" + state.id + ".png"} style={{ width: 120, height: 120, margin: 'auto' }}>{ (state.id == 'newProject') ? 'New Project' : state.name}</Avatar>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Project Id</TableCell>
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
                                        <TableCell>Owner</TableCell>
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