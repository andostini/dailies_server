import React from "react"
import Header from "./header.js"
import Live from "./live.js"
import Playback from "./playback.js"

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        return (
            <div className="col-md-6 col-sm-12 Player order-last order-md-first">
                <div className="card">
                    <Header></Header>
                    <div className="tab-content card-body">
                        <Playback clip={this.props.clip}></Playback>
                        <Live Source="liveA"></Live>
                        <Live Source="liveB"></Live>
                        <Live Source="liveC"></Live>
                        <Live Source="liveD"></Live>
                    </div>
                </div>
                
                

            </div>
        )
    }
}