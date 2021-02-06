import React from "react";
import {Grid} from "@material-ui/core";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const data =this.props.data;
        return(
            <Grid item sm={3} >
                {data.clipname}
            </Grid>
        )
    }
}