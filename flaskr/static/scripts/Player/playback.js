import { Typography, Table, TableCell, TableRow, TableContainer } from "@material-ui/core";
import React from "react"
import VideoPlayer from "../VideoPlayer"

export default class Playback extends React.Component {
    constructor(props) {
        super(props);
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
            const clip = this.props.clip;
            return (
                <div className="" id="playback">
                    <Typography variant="h3"><span className="cameraA">{clip.camera}</span> / {clip.scene} - {clip.shot} - {clip.take}</Typography>
                    <span style={{float: "right"}} className={clip.label + " badge badge-pill badge-primary"}>{clip.label}</span>

                    <div id="playback_video_tag">             
                        <VideoPlayer src={clip.playbackfile}></VideoPlayer>     
                    </div>
                    <TableContainer>
                        <Table size="small">
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
                        </Table>
                    </TableContainer>
                </div>
            )
        }

    }
}