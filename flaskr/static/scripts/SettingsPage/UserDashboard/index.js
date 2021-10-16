import React from 'react';
import {  } from '@material-ui/core';
import Form from './form';


export default class UserDashboard extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        const userInfo = this.props.userInfo;
        return(
            <React.Fragment>
                {userInfo
                    ? <Form userInfo={userInfo} />
                    : <p>Loading</p>
                }
            </React.Fragment>
        )
    }
}
