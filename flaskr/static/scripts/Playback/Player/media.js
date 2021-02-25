import React from "react";
import {Paper, Tabs, Tab, Box} from "@material-ui/core";
import VideoPlayer from "../VideoPlayer";
import StillsGallery from "../StillsGallery";

function Tabpanel(props) {
    const { children, tab, index } = props;
    return(
        <Box hidden={tab !== index}>
            {children}
        </Box>
    );
}


export default class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            tab: 0
        };
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event, value) {  
        event.preventDefault();  
        this.setState({
            tab: value
        });
    }

    render() {
        const clip = this.props.clip;
        var tab = this.state.tab;
        var video = false;
        var stills = false;

        if (clip.stills.length > 0) {
            stills = true;
        }
        if (clip.playbackfile != "") {
            video = true;
        }

        if (!video && stills && tab==0) { 
            tab = 1;
        }

        if (video && !stills && tab==1) {
            tab = 0;
        }


        return(
            <div>
                <Paper id='player'>
                    <Tabs value={tab} onChange={this.handleChange}>
                        <Tab label="Video" disabled={!video} />
                        <Tab label="Stills"  disabled={!stills} />
                    </Tabs>
                    <Tabpanel tab={tab} index={0}>            
                        <VideoPlayer src={clip.playbackfile}></VideoPlayer>     
                    </Tabpanel>
                    <Tabpanel tab={tab} index={1}>
                        <StillsGallery src={clip.stills}></StillsGallery>
                    </Tabpanel>

                </Paper>
                
            </div>
        )
    }
}