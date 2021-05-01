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
        this.state = {
            page: (window.project.libraryPageVisible == 1) ? 0 : 1,
            cameraA: true,
            cameraB: true,
            cameraC: true,
            cameraD: true,
        }
        this.toggleCam = this.toggleCam.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
        const { cameraA, cameraB, cameraC, cameraD } = this.state;

        const buttonStyle = {
            padding: '5px',
            marginLeft: '5px'
        }

        return (
            <React.Fragment>
                <Navbar>
                    <Typography variant="subtitle2" align="right">
                        You are logged in as <strong>{window.userName} <br /></strong>Project: <strong> {window.project.name}</strong>
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
                        <Playback />
                    }
                </Page>
                <Page page={page} index={1}>
                    {window.project.livePageVisible == 1 &&
                        <Live cameraA={cameraA} cameraB={cameraB} cameraC={cameraC} cameraD={cameraD} />
                    }   
                </Page>
                <Footer />
            </React.Fragment>
        );
    }
}

