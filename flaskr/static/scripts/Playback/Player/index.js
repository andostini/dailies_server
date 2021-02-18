import { Typography, Grid, Tooltip,IconButton } from "@material-ui/core";
import React from "react"
import ExtendedMeta from './extendedmeta'
import Media from "./media"
import CloseIcon from '@material-ui/icons/Close';
import MovieIcon from '@material-ui/icons/Movie';

export default class Playback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showExtendedMeta: false
        }
        this.ToggleExtendedMeta = this.ToggleExtendedMeta.bind(this);

    }
    ToggleExtendedMeta() {
        this.setState({
            showExtendedMeta: !this.state.showExtendedMeta
        })
    }
    render() {
        if (!this.props.clip) {
            return (
                <div id="playback">
                    Please select a clip from the Project Libraray
                </div>
            )
        }
        else {

            try {
                this.props.clip.cameraMeta = JSON.parse(this.props.clip.cameraMeta);
            }
            catch (e) {

            }
            const clip = this.props.clip;
            const showExtendedMeta = this.state.showExtendedMeta;
            return (

                <div className="" id="playback">
                    <Tooltip title="Close" style={{float: 'right'}} onClick={this.props.closePlayer} placement='right-start' >
                        <IconButton aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>

                    <Media clip={clip} ></Media>
                    <Grid container style={{ padding: '15px' }}>
                        <Grid xs={10}>
                            <Typography variant='h2' style={{ display: 'inline' }}><MovieIcon style={{ fontSize: 32 }} />
                                <span className="cameraA"> {clip.camera}</span> / {clip.scene} - {clip.shot} - {clip.take}</Typography>
                        </Grid>
                        <Grid xs={2}>
                            <span className={clip.label + " badge badge-pill badge-primary"}>{clip.label}</span>
                        </Grid>
                        <Grid xs={12}>
                            {clip.clipname}
                        </Grid>
                        <Grid xs={12} mt={10}>
                            Script Comment: <br />
                            {clip.comment}
                        </Grid>
                    </Grid>

                    <p onClick={() => this.ToggleExtendedMeta()}>Show Extended Meta </p>
                    <div style={{ display: showExtendedMeta ? "block" : "none" }}>
                        <ExtendedMeta clip={clip}></ExtendedMeta>
                    </div>
                </div>
            )
        }

    }
}