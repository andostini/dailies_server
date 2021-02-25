import React from 'react';
import { Grid, Container, Paper, Typography } from '@material-ui/core';
import VJSPlayer from './VJSPlayer';
import InfoIcon from '@material-ui/icons/Info';


function YoutubePlayer(props) {
    return (
        <div className="youtube-player">
            <iframe
                width="100%"
                height="auto"
                src={props.src}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
        </div>
    )
}

function Player(props) {
    if (props.service == 'Youtube') {
        return (<YoutubePlayer src={props.url} />)
    }
    else {
        const streamSource = 'https://stream.franconia-film.de/hls/' + props.streamKey + '.m3u8';
        const videoJsOptions = {
            autoplay: true,
            controls: true,
            width: '100px',
            sources: [{
                src: 'https://stream.franconia-film.de/hls/' + props.streamKey + '.m3u8',
                type: 'application/x-mpegURL'
            }]
        }
        return (<VJSPlayer {...videoJsOptions} streamSource={streamSource} streamInfo={props} />)
    }
}


export default class Live extends React.Component {
    constructor(props) {
        super(props);
        this.resize = this.resize.bind(this);

    }

    resize() {
        this.forceUpdate();
    }

    render() {
        const liveStreams = window.liveStreams;
        const { cameraA, cameraB, cameraC, cameraD } = this.props;
        let numberOfActiveViews = 0;
        let gridWidth = 12;
        if (cameraA) { numberOfActiveViews = numberOfActiveViews + 1 }
        if (cameraB) { numberOfActiveViews = numberOfActiveViews + 1 }
        if (cameraC) { numberOfActiveViews = numberOfActiveViews + 1 }
        if (cameraD) { numberOfActiveViews = numberOfActiveViews + 1 }

        let portrait = window.innerHeight > window.innerWidth;

        if (numberOfActiveViews == 2) {
            if (portrait) {
                gridWidth = 12
            }
            else {
                gridWidth = 6
            }
        }
        if (numberOfActiveViews > 2) { gridWidth = 6 }

        window.addEventListener('resize', this.resize);

        return (
            <Container maxWidth={false} style={{ padding: 20 }}>
                <Grid container>
                    <Grid item xs={gridWidth} hidden={!cameraA}>
                        <Player {...liveStreams[0]} />
                    </Grid>
                    <Grid item xs={gridWidth} hidden={!cameraB}>
                        <Player {...liveStreams[1]} />
                    </Grid>
                    <Grid item xs={gridWidth} hidden={!cameraC}>
                        <Player {...liveStreams[2]} />
                    </Grid>
                    <Grid item xs={gridWidth} hidden={!cameraD}>
                        <Player {...liveStreams[3]} />
                    </Grid>
                    <Grid item xs={12} container justify="center" alignItems="stretch" >
                        {liveStreams.map((liveStream, i) =>
                             <Grid item xs={6} md={3} style={{padding: 10}} hidden={window.userName == 'viewer'} key={'streamInfo-' + liveStream.camera}>
                                <Paper style={{padding: 20}}>
                                    <Typography variant='h5'><InfoIcon /> Stream Info</Typography>
                                    Camera: <span className={'camera' + liveStream.camera}>{liveStream.camera}</span><br />
                                    Service: {liveStream.service}<br />
                                    <span style={{lineBreak: 'anywhere'}}> URL: {liveStream.url}</span><br />
                                    Stream Key: {liveStream.streamKey}
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

            </Container >
        )
    }
}