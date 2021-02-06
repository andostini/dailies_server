import React from "react";
import {Grid, Box} from "@material-ui/core";
import MaterialTable, { MTableBody, MTableBodyRow, MTableFilterRow } from 'material-table';

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const data =this.props.data;
        return(
            <Grid item sm={3} >
                <img src={data.thumbnail} width='100%' />
                {data.clipname}
            </Grid>
        )
    }
}

export class Body extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const props =this.props.props;
        const data = props.renderData;
        console.log(props);
        return(
            <Grid container spacing={3}>
                <MTableBody {...props} />
            </Grid>
        )
    }
}