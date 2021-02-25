import React from "react";
import {} from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';


function TabPanel(props) {
    const {index, tab } = props;
    return(
        <img hidden={index != tab} src={"../static/projects/project-" + window.project.id + "/stills/" + props.src}  width="100%"/>
    )
}

export default class StillsGallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, value) {
        
        event.preventDefault();
        this.setState({
            tab: value -1
        });
    }

    render() {
        const stills = this.props.src;
        const tab = this.state.tab;
        if (stills.length == 0) {
            return(
                <p>No still images found for this clip</p>
            )
        }
        else if (stills.length == 1) {
            return (
                <img src={"../static/projects/project-" + window.project.id + "/stills/" + stills[0]} width="100%" />
            )
        }
        else if (stills.length > 1) {
            return(
                <React.Fragment>
                    {stills.map((img, index) => (
                        <TabPanel key={index} src={img} index={index} tab={tab}></TabPanel>
                    ))}
                    <Pagination onChange={this.handleChange} count={stills.length} />
                </React.Fragment>   
            )
        }
        
    }
}