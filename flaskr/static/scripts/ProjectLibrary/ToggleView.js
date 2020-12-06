import React from "react"

export default class ToggleView extends React.Component {
    render() {
        return (
            <div className="btn-group btn-group-toggle" style={{float:'right'}}>
                <label className="btn btn-secondary">
					<input type="radio" name="view" id="Toggle_thumbnail-view" autoComplete="off" checked=""></input><i className="fas fa-th" aria-hidden="true"></i>
				</label>
                <label className="btn btn-secondary active">
					<input type="radio" name="view" id="Toggle_list-view" autoComplete="off"></input><i className="fas fa-bars" aria-hidden="true"></i>
				</label>
                <label className="btn btn-secondary">
					<input type="radio" name="view" id="Toggle_list-thumbnail-view" autoComplete="off"></input><i className="fas fa-list" aria-hidden="true"></i>
				</label>
            </div>
        );
    }
}