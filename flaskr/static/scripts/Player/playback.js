import React from "react"
import VideoPlayer from "../VideoPlayer"

export default class Playback extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (!this.props.clip) {
            return (
                <div className="tab-pane fade show active" id="playback" role="tabpanel" aria-labelledby="home-tab">
                    Please select a clip from the Project Libraray
                </div>
            )
        }
        else {
            const clip = this.props.clip;
            return (
                <div className="tab-pane fade show active" id="playback" role="tabpanel" aria-labelledby="home-tab">
                    <span className="text-muted display-4"><span className="cameraA">{clip.camera}</span> / {clip.scene} - {clip.shot} - {clip.take}</span>
                    <span style={{float: "right"}} className={clip.label + " badge badge-pill badge-primary"}>{clip.label}</span>

                    <div id="playback_video_tag">             
                        <VideoPlayer src={clip.playbackfile}></VideoPlayer>     
                    </div>
                </div>
            )
        }

    }
}