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
        fetch("../api/get_CovideoLibrary/" + window.projectId, {
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
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>
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