import React from "react"

export default class Header extends React.Component {
    render() {
        return(
            <div className="card-header" role="tablist">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item"><a className="nav-link" id="playback-tab" data-toggle="tab" href="#playback" role="tab" aria-controls="playback" aria-selected="true">Playback</a></li>  
                    <li className="nav-item"><a className="nav-link" id="liveA-tab" data-toggle="tab" href="#liveA" role="tab" aria-controls="liveA" aria-selected="false">Live A</a></li>  
                    <li className="nav-item"><a className="nav-link" id="liveB-tab" data-toggle="tab" href="#liveB" role="tab" aria-controls="liveB" aria-selected="false">Live B</a></li>  
                    <li className="nav-item"><a className="nav-link" id="liveC-tab" data-toggle="tab" href="#liveC" role="tab" aria-controls="liveC" aria-selected="false">Live C</a></li>  
                    <li className="nav-item"><a className="nav-link" id="liveD-tab" data-toggle="tab" href="#liveD" role="tab" aria-controls="liveD" aria-selected="false">Live D</a></li>  
                </ul>
            </div>
        )
    }
}