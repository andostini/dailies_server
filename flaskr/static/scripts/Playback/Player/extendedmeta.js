import React from 'react'
import {Table, TableBody, TableRow, TableCell, TableContainer, TableHead} from '@material-ui/core'


class Rows extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const data = this.props.data;
        const keys = Object.keys(data);
        return(
            
            keys.map(key => (
                <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{data[key]}</TableCell>
                </TableRow>
            ))
        )
    }
}

export default class ExtendedMeta extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const cameraMeta = this.props.clip.cameraMeta;
        const keys = Object.keys(cameraMeta)
        return(
            
            keys.map(key => (
                <TableContainer key={key}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2}>{key}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            <Rows data={cameraMeta[key]}></Rows>
                        </TableBody>
                    </Table>
                </TableContainer>
                
            ))
        )
    }
}   