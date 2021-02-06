import React from 'react';
import Navbar from "../Navbar";
import Playback from "../Playback";



class PlayerPage extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <React.Fragment>
                <Navbar></Navbar>
                <Playback></Playback>
           </React.Fragment>
        );
    }}
export default PlayerPage;
