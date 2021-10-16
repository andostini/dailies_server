import React from "react";
import ProjectLibrary from "./ProjectLibrary";
import { Box, Grid, Container} from '@material-ui/core';
import Player from "./Player";




export default class Playback extends React.Component {
    constructor() {
        super();        
        this.state = {
            currentClip: null,
            showExtendedMeta: false,
            fullScreenLib: true
        }
        this.PlayClip = this.PlayClip.bind(this);
        this.closePlayer = this.closePlayer.bind(this);
    }

    PlayClip(clip) {
        this.setState({
            currentClip: clip,
            fullScreenLib: false
        });
    }

    closePlayer() {
        this.setState({
            currentClip: null,
            fullScreenLib: true
        })
    }

    render() {
        const fullScreenLib = this.state.fullScreenLib;
        const writePermission = this.props.writePermission;
        var libMdSpan = 6;
        if (fullScreenLib) {
            libMdSpan = 12;
        }
        return (
            <Container maxWidth={false} style={{padding: 20}}>
                <Grid container spacing={2} display="flex">
                    <Box  hidden={fullScreenLib} clone order={{xs: 1, md: 2}}>
                        <Grid item sm={12} md={6} >
                            <Player clip={this.state.currentClip} closePlayer={this.closePlayer}></Player>
                        </Grid>
                    </Box>
                    <Box clone order={{xs: 2, md: 1}}>
                        <Grid item sm={12} md={libMdSpan} >
                            <ProjectLibrary PlayClip={this.PlayClip} isFullscreen={fullScreenLib} writePermission={writePermission}></ProjectLibrary>
                        </Grid>
                    </Box>
                </Grid>
            </Container>
        )
    }
}

