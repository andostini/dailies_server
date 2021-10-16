import React from 'react';
import Navbar from "../Navbar";
import Playback from "../Playback";
import Live from "../Live";
import { AppBar, Tabs, Tab, Box, Button, Grid, Typography } from '@material-ui/core';
import Footer from '../Footer';


function Page(props) {
    const { children, page, index } = props;
    return (
        <Box hidden={page !== index} style={{ minHeight: '100vh' }}>
            {children}
        </Box>
    );
}


export default class ViewerPage extends React.Component {
    constructor() {
        super();

        // Retrieve Live View Settings from local Storage
        let active_cams = window.localStorage.getItem('active_cams_' + window.project.id)
        if (active_cams) {
            active_cams = JSON.parse(active_cams);
        }
        else {
            active_cams = {
                cameraA: true,
                cameraB: false,
                cameraC: false,
                cameraD: false            }
        }

        

        this.state = {
            page: (window.project.libraryPageVisible == 1) ? 0 : 1,
            cameraA: active_cams.cameraA,
            cameraB: active_cams.cameraB,
            cameraC: active_cams.cameraC,
            cameraD: active_cams.cameraD,
            writePermission: false,  
            userInfo: null,
            loaded: false
        }
        this.toggleCam = this.toggleCam.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch("../api/getProjectInfo/" + window.project.id, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                access_token: localStorage.getItem("access_token"),
                project_token: localStorage.getItem("project_token")
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    window.project = result.project
                    window.liveStreams = result.liveStreams
                    this.setState({
                        writePermission: result.project.writePermission,
                        loaded: true
                    })
                },
                (error) => {
                    console.log(error);
                    
                    
                }
            )

        fetch("../api/get_CovideoLibrary/" + window.project.id, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                access_token: localStorage.getItem("access_token"),
                project_token: localStorage.getItem("project_token")
            })
        })
            .then(
                (res) => {
                    if (res.status == 200) {
                        return res.json();
                    }
                    else {
                        window.location.replace('/auth/login/' + window.project.id)
                    }
                }
            )
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        items: result
                    });

                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )

        fetch("../api/getUserInfo", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                access_token: localStorage.getItem("access_token")
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        userInfo: result
                    });

                },
                (error) => {
                    console.log(error);
                }
            )
    }

    componentDidUpdate() {
        // Save Live View Settings to local Storage
        let active_cams = {
            cameraA: this.state.cameraA,
            cameraB: this.state.cameraB,
            cameraC: this.state.cameraC,
            cameraD: this.state.cameraD,
        }
        
        window.localStorage.setItem('active_cams_' + window.project.id, JSON.stringify(active_cams));
    }

    handleChange(event, value) {
        event.preventDefault();
        this.setState({
            page: value
        })
    }

    toggleCam(camera) {
        this.setState({
            [camera]: !this.state.[camera]
        })
        
    }

    render() {
        const page = this.state.page;
        const loaded = this.state.loaded;
        const { cameraA, cameraB, cameraC, cameraD, writePermission, userInfo } = this.state;


        const buttonStyle = {
            padding: '5px',
            marginLeft: '5px'
        }

        if (loaded) {
            return (
                <React.Fragment>
                    <Navbar userInfo={userInfo}>
                        <Typography variant="subtitle2" align="right">
                            {userInfo &&
                                <span>You are logged in as <strong>{userInfo.userName} </strong><br /></span>
                            }
                            Project: <strong> {window.project.name}</strong>
                        </Typography>
                    </Navbar>
                    <AppBar position='static' >
                        <Grid container alignItems="center">
                            <Grid item xs={6}>
                                <Tabs value={page} onChange={this.handleChange}>
                                    {window.project.libraryPageVisible == 1 &&
                                        <Tab label='Library' value={0}/>
                                    }
                                    {window.project.livePageVisible == 1 &&
                                        <Tab label='Live' value={1} />
                                    }   
                                </Tabs>
                            </Grid>
                            <Grid hidden={page == 0} item xs={6} style={{ textAlign: 'right', paddingRight: 10 }}>
                                <Button style={buttonStyle} variant="outlined" color={cameraA ? 'secondary' : ''} value='cameraA' selected={cameraA} onClick={() => { this.toggleCam('cameraA'); }}>A</Button>
                                <Button style={buttonStyle} variant="outlined" color={cameraB ? 'secondary' : ''} value='cameraB' selected={cameraB} onClick={() => { this.toggleCam('cameraB'); }}>B</Button>
                                <Button style={buttonStyle} variant="outlined" color={cameraC ? 'secondary' : ''} value='cameraC' selected={cameraC} onClick={() => { this.toggleCam('cameraC'); }}>C</Button>
                                <Button style={buttonStyle} variant="outlined" color={cameraD ? 'secondary' : ''} value='cameraD' selected={cameraD} onClick={() => { this.toggleCam('cameraD'); }}>D</Button>
                            </Grid>
                        </Grid>
    
                    </AppBar>
                    <Page page={page} index={0}>
                        {window.project.libraryPageVisible == 1 &&
                            <Playback writePermission={writePermission} />
                        }
                    </Page>
                    <Page page={page} index={1}>
                        {window.project.livePageVisible == 1 &&
                            <Live cameraA={cameraA} cameraB={cameraB} cameraC={cameraC} cameraD={cameraD}  writePermission={writePermission} />
                        }   
                    </Page>
                    <Footer />
                </React.Fragment>
            );
        }

        else {
            return(
                <h1>Loading</h1>
            )
        }


    }
}

