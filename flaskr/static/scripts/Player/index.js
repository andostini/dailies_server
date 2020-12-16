import React from "react"
import Live from "./live.js"
import Playback from "./playback.js"
import { Box, Paper, Tabs, Tab } from "@material-ui/core"


function TabPanel(props) {
    const tabIndex = props.tabIndex;
    const index = props.index;
    return (
        <div role="tabpanel" hidden={tabIndex !== index} >
            <Box p={3}>
                {props.children}
            </Box>
        </div>
    )
}

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, value) {
        this.setState({
            tabIndex: value
        })
    }

    render() {
        const tabIndex = this.state.tabIndex;
        return (
            <div>    
                <Paper>
                    <Tabs value={tabIndex} onChange={this.handleChange} variant="fullWidth" >
                        <Tab label="Playback" />
                        <Tab label="Live A"/>
                        <Tab label="Live B"/>
                        <Tab label="Live C"/>
                        <Tab label="Live D"/>
                    </Tabs>
                    <TabPanel tabIndex={tabIndex} index={0}>
                        <Playback clip={this.props.clip}></Playback>
                    </TabPanel>
                    <TabPanel tabIndex={tabIndex} index={1}>
                        <Live src="" type="inhouse"></Live>
                    </TabPanel>
                    <TabPanel tabIndex={tabIndex} index={2}>
                        <Live src="" type="inhouse"></Live>
                    </TabPanel>
                    <TabPanel tabIndex={tabIndex} index={3}>
                        <Live src="" type="inhouse"></Live>
                    </TabPanel>
                    <TabPanel tabIndex={tabIndex} index={4}>
                        <Live src="" type="inhouse"></Live>
                    </TabPanel>
                </Paper>
            </div>
        )
    }
}