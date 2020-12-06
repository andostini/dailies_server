import React from "react"
import Playback from "../Player/playback.js"

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
                    <tr key={item.clipname} onClick={(e) => this.play(item, e)}>
                        <td>{item.scene}</td>
                        <td>{item.shot}</td>
                        <td>{item.take}</td>
                        <td>{item.clipname}</td>
                        <td>{item.cam}</td>
                        <td>{item.reel}</td>
                        <td></td>
                        <td>{item.label}</td>
                    </tr>
                ))
            )
        }
    }
}