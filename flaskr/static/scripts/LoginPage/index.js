import React from 'react';
import Ulogin from './login';
import Plogin from './plogin';



export default class Login extends React.Component {
    constructor(){
        super();
    }

    render() {
        if (window.location.href.endsWith("/login")) {
            return(
                <Ulogin />
            )
        }
        else {
            //Generate ProjectID from current Window location
            var pathArray = window.location.pathname.split('/');
            pathArray.reverse()
            var projectId = pathArray[0]
            return(
                <Plogin projectId={projectId}/>
            )
        }
    }
}
