import React from "react"

export default class Live extends React.Component {
    constructor(props) {
        super(props);
        this.state = {source: this.props.Source}
    }
    render() {
        return(
            <div className="tab-pane fade CovideoPlayerTab" id={this.state.source} role="tabpanel" aria-labelledby={this.state.source + "-tab"}>
                {this.state.source}
            </div>
        )
    }
}