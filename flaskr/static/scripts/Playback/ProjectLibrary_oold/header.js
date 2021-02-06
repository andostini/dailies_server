import React from "react"
import ToggleView from "./ToggleView"

export default class Header extends React.Component {
    render() {
        return (
            <div>
                <h3 className="h5" style={{float: 'left'}}>Project Library</h3>
                <ToggleView></ToggleView>
                <div style={{clear: 'both'}}></div>
            </div>
        );
    }
}