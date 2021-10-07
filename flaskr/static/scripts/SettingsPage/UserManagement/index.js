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

        if (val == "newUser") {
            this.setState({
                userInForm: val,
                rowSelected: null
            })
        }
        else {
            this.setState({
                userInForm: val,
                rowSelected: e.target
            })
            console.log(val)
        }
    }
    

    updateUserTable() {
        this.UserTableRef.current.update();
    }

    render() {
        const {userInForm} = this.state;
        return(
            <React.Fragment>
                <UserTable changeUserInForm={this.changeUserInForm} ref={this.UserTableRef} />
                <Form changeUserInForm={this.changeUserInForm} user={userInForm} updateUserTable={this.updateUserTable} />
            </React.Fragment>
        );
    }
}