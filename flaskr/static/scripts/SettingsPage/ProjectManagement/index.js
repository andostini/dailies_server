import React from 'react';
import {  } from '@material-ui/core';
import Form from './form';
import ProjectTable from './projecttable'




export default class ProjectManagement extends React.Component {
    constructor() {
        super();
        this.state = {
            ProjectInForm: 'newProject'
        } 
        this.ProjectTableRef = React.createRef();
        this.changeProjectInForm = this.changeProjectInForm.bind(this);
        this.updateProjectTable = this.updateProjectTable.bind(this);
    }

    changeProjectInForm(e, val) {
        this.setState({
            ProjectInForm: val
        })
    }

    updateProjectTable() {
        this.ProjectTableRef.current.update();
    }

    render() {
        const ProjectInForm = this.state.ProjectInForm;
        return(
            <React.Fragment>
                <ProjectTable changeProjectInForm={this.changeProjectInForm} ref={this.ProjectTableRef} />
                <Form changeProjectInForm={this.changeProjectInForm} project={ProjectInForm} updateProjectTable={this.updateProjectTable}/>
            </React.Fragment>
        );
    }
}