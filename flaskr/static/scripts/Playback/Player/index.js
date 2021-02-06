import { Typography, Table, TableCell, TableRow, TableBody, TableContainer, Box, Paper, Tabs, Tab } from "@material-ui/core";
import React from "react"
import ExtendedMeta from './extendedmeta'
import Media from "./media"
import CloseIcon from '@material-ui/icons/Close';

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
            catch(e) {

            }
            const clip = this.props.clip;
            const showExtendedMeta = this.state.showExtendedMeta;
            return (
                
                <div className="" id="playback">
                    <Box style={{padding: '10px'}}>
                        <CloseIcon style={{float: "right", display: "inline"}} onClick={this.props.closePlayer} />
                        
                        <Typography variant="h3"><span className="cameraA">{clip.camera}</span> / {clip.scene} - {clip.shot} - {clip.take}</Typography>
                        <span className={clip.label + " badge badge-pill badge-primary"}>{clip.label}</span>
                    </Box>

                    <Media clip={clip}></Media>

                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Clipname</TableCell>
                                    <TableCell>{clip.clipname}</TableCell>
                                    <TableCell>Reel</TableCell>
                                    <TableCell>{clip.reel}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Scene</TableCell>
                                    <TableCell>{clip.scene}</TableCell>
                                    <TableCell>Camera</TableCell>
                                    <TableCell>{clip.camera}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Shot</TableCell>
                                    <TableCell>{clip.shot}</TableCell>
                                    <TableCell>Label</TableCell>
                                    <TableCell>{clip.label}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Take</TableCell>
                                    <TableCell>{clip.take}</TableCell>
                                    <TableCell>Comment</TableCell>
                                    <TableCell>{clip.comment}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <p onClick={() => this.ToggleExtendedMeta()}>Show Extended Meta </p>
                    <div style={{display: showExtendedMeta ? "block" : "none"}}>
                        <ExtendedMeta clip={clip}></ExtendedMeta>
                    </div>
                </div>
            )
        }

    }
}