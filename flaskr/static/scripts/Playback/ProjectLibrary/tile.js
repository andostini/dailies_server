import * as React from "react";
import { Grid, TableBody, Card, CardActionArea, CardMedia, CardContent, Typography } from "@material-ui/core";
import MaterialTable, { MTableBody, MTableBodyRow, MTableFilterRow } from 'material-table';
/* eslint-disable no-unused-vars */
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import PropTypes from "prop-types";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

/* eslint-enable no-unused-vars */

export class Body extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const rows = this.props.renderData;
        var filterRow = null;
        if (this.props.options.filtering) {
            filterRow = <MTableFilterRow {...this.props} />
        }

        return (
            <React.Fragment>
                <TableBody>
                    {filterRow}


                    <TableRow>
                        <TableCell colSpan="7">
                            <Grid container spacing={2} alignItems="stretch" direction="row" justify="flex-start">
                                {rows.map((row, index) => (
                                    <Tile {...this.props} data={row} index={index} key={'row-' + index} isFullscreen={this.props.isFullscreen} ></Tile>
                                ))}
                            </Grid>
                        </TableCell>
                    </TableRow>

                </TableBody>
            </React.Fragment>
        )
    }
}


export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.onRowClick = this.onRowClick.bind(this);
    }

    onRowClick(e) {
        this.props.onRowClick(e, this.props.data);
    }

    render() {

        const videoResource = (playbackfile) => {
            if (playbackfile != "") {
                return <PlayCircleOutlineIcon style={{ float: 'right', fontSize: 15 }} />
            }
            else {
                return ""
            }
        }
        const stillsResource = (stills) => {
            if (stills.length == 1) {
                return <InsertPhotoIcon style={{ float: 'right', fontSize: 15 }} />
            }
            else if (stills.length > 1) {
                return <PhotoLibraryIcon style={{ float: 'right', fontSize: 15 }} />
            }
            else {
                return ""
            }
        }

        const data = this.props.data;
        const props = this.props;
        var itemSizes = {
            xs: 6,
            sm: 4,
            md: 4,
            lg: 3,
            xl: 2
        }
        if (props.isFullscreen) {
            itemSizes = {
                xs: 6,
                sm: 4,
                md: 3,
                lg: 2
            }
        }
        return (
            <Grid item {...itemSizes} onClick={this.onRowClick}>
                <Card height='100%'>
                    <CardActionArea>
                        <CardMedia component="div" style={{ width: '100%', height: 0, backgroundImage: 'url(' + data.thumbnail + ')' }} className={'thumbnail ' + data.label} />
                        <CardContent style={{ padding: '7px' }}>
                            <Typography style={{ fontSize: '15px', lineHeight: 1 }}><span className={'camera' + data.camera}>{data.camera}</span> / {data.scene} - {data.shot} - {data.take}  {videoResource(data.playbackfile)}{stillsResource(data.stills)}</Typography>
                            <Typography style={{ fontSize: '10px' }}>{data.clipname}
                            </Typography>

                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        )
    }
}
