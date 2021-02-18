import React from "react"

export default class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const src = this.props.src;
        if (src == "") {
            return <p style={{padding: 25, fontSize: 24}}>No video file for this clip</p>
        }
        else {
            return (
                <video style={{width: "100%"}} controls key={src}>               
                    <source src={"../static/projects/project-" + window.project.id + "/video/" + src} type="video/mp4"></source>             
                </video>  
            )
        }
    }
}