import React from "react";
import { TableRow, TableCell } from "@material-ui/core";

export default class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
        this.play = this.play.bind(this);
    }

    componentDidMount() {
        fetch("../api/get_CovideoLibrary/" + window.project.id, {
            method: "POST"
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                    console.log(result);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    play(item, e) {
       this.props.PlayClip(item)
    }
    
    render() {
        const { error, isLoaded, items} = this.state;
        if (error) {
            return (
                <TableRow>
                    <TableCell colSpan={8} style={{backgroundColor: '#e57373'}}>
                        <p>Error: {error.message}</p>
                    </TableCell>
                </TableRow>
            );
        } else if (!isLoaded) {
            return (                
                <TableRow>
                    <TableCell colSpan={8} style={{backgroundColor: '#7986cb'}}>
                        <p>Loading...</p>
                    </TableCell>
                </TableRow>
            );
        } else {
            return (
                items.map(item => (
                    <TableRow key={item.clipname} onClick={(e) => this.play(item, e)}>
                        <TableCell>{item.scene}</TableCell>
                        <TableCell>{item.shot}</TableCell>
                        <TableCell>{item.take}</TableCell>
                        <TableCell>{item.clipname}</TableCell>
                        <TableCell className={"camera" + item.camera}>{item.camera}</TableCell>
                        <TableCell>{item.reel}</TableCell>
                        <TableCell></TableCell>
                        <TableCell><div className={"badge " + item.label}>{item.label}</div></TableCell>
                    </TableRow>
                ))
            )
        }
    }
}