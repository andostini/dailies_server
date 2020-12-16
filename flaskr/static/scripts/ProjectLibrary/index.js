import React from 'react';
import Header from "./header"
import Body from "./body"
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Box,Button, ButtonGroup} from "@material-ui/core";
import BackupIcon from '@material-ui/icons/Backup';
import EditIcon from '@material-ui/icons/Edit';

export default class ProjectLibrary extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <Header></Header>
                <div className="table-responsive-sm">
                    <TableContainer component={Box}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan="3">Scene</TableCell>
                                    <TableCell>Clipname</TableCell>
                                    <TableCell>Cam</TableCell>
                                    <TableCell>Reel</TableCell>
                                    <TableCell>Res</TableCell>
                                    <TableCell>Label</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Body PlayClip={this.props.PlayClip}></Body>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <ButtonGroup mt={5} color="primary" variant="contained" aria-label="contained primary button group">
                    <Button startIcon={<BackupIcon />} href={"/viewer/" + window.project.id + "/upload"}>Upload</Button>
                    <Button startIcon={<EditIcon />} href={"/viewer/" + window.project.id + "/meta"}>Meta Editor</Button>
                </ButtonGroup>

            </React.Fragment>
        );
    }

    
}