import React from 'react';
import ProjectLibrary from "../ProjectLibrary"
import Player from "../Player"

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
            <div className="row content">
                <ProjectLibrary PlayClip={this.PlayClip}></ProjectLibrary>
                <Player clip={this.state.currentClip}></Player>
            </div>
        );
    }}
export default PlayerPage;
