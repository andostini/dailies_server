import React from 'react';
import ProjectLibrary from "../ProjectLibrary"
import Player from "../Player"
import { Grid, Container} from '@material-ui/core';
import Navbar from "../Navbar";



class PlayerPage extends React.Component {
    constructor() {
        super();
        this.state = {
            currentClip: null
        }
        this.PlayClip = this.PlayClip.bind(this);
    }

    PlayClip(clip) {
        this.setState({
            currentClip: clip
        });
    }

    render() {
        
        return (
            <React.Fragment>
                <Navbar></Navbar>
                <Container maxWidth={false} style={{padding: 0}}>
                    <Grid container spacing={1}>
                        <Grid item md={12} lg={6}>
                            <Player clip={this.state.currentClip}></Player>
                        </Grid>
                        <Grid item md={12} lg={6}>
                            <ProjectLibrary PlayClip={this.PlayClip}></ProjectLibrary>
                        </Grid>
                    </Grid>
                </Container>
           </React.Fragment>
        );
    }}
export default PlayerPage;
