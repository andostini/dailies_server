import React from "react"

export default class Live extends React.Component {
    constructor(props) {
        super(props);
        this.state = {source: this.props.Source}
    }
    render() {
        return(
            <div>
                {this.state.source}
            </div>
        )
    }
}