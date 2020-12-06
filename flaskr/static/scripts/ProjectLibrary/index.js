import React from "react"
import Header from "./header"
import Body from "./body"

export default class ProjectLibrary extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="col-md-6 col-sm-12 projectLibrary order-last order-md-first">
                <Header></Header>
                <div className="table-responsive-sm">
                    <table className="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th scope="col" colSpan="3">Scene</th>
                                <th scope="col">Clipname</th>
                                <th scope="col">Cam</th>
                                <th scope="col">Reel</th>
                                <th scope="col">Res</th>
                                <th scope="col">Label</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Body PlayClip={this.props.PlayClip}></Body>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    
}