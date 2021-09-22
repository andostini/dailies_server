import React from 'react';
import {  } from '@material-ui/core';
import Form from './form';
import UserTable from './usertable'




export default class UserManagement extends React.Component {
    constructor() {
        super();
        this.state = {
            userInForm: 'newUser'
        } 
        this.UserTableRef = React.createRef();
        this.changeUserInForm = this.changeUserInForm.bind(this);
        this.updateUserTable = this.updateUserTable.bind(this);
    }

    changeUserInForm(e, val) {
        this.setState({
            userInForm: val
        })
    }

    updateUserTable() {
        this.UserTableRef.current.update();
    }

    render() {
        const userInForm = this.state.userInForm;
        return(
            <React.Fragment>
                <UserTable changeUserInForm={this.changeUserInForm} ref={this.UserTableRef} />
                <Form changeUserInForm={this.changeUserInForm} user={userInForm} updateUserTable={this.updateUserTable}/>
            </React.Fragment>
        );
    }
}