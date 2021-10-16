import React from 'react';
import Navbar from "../Navbar";
import Footer from '../Footer';
import Sidebar from './sidebar'
import UserManagement from './UserManagement'
import ProjectManagement from './ProjectManagement'
import UserDashboard from './UserDashboard'
import { Grid, Typography, Container, Box } from '@material-ui/core';



function Page(props) {
    const { children, page, index, title } = props;
    return (
        <Box hidden={page !== index} style={{ minHeight: '100vh' }}>
            <Typography variant='h2'>{title}</Typography>
            {children}
        </Box>
    );
}

export default class SettingsPage extends React.Component {
    constructor() {
        super();
        this.state ={
            page: 0,
            userInfo: null
        }
        this.changePage = this.changePage.bind(this);
    }

    componentWillMount() {
        fetch("/settings/getUser", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                access_token: localStorage.getItem("access_token")
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        userInfo: result
                    });
                    console.log(result)

                },
                (error) => {
                    console.log(error);
                }
            )
    }

    changePage(val) {
        this.setState({
            page: val
        });
    }

    render() {
        
        const {page, userInfo} = this.state;
        if (userInfo == null) {
            return(<h1>Loading</h1>)
        }
        else {
            return(
                <React.Fragment>
                    <Navbar userInfo={userInfo}> 
                        <Typography variant="subtitle2" align="right">
                            {userInfo &&
                                <span>You are logged in as <strong>{userInfo.userName} </strong><br /></span>
                            }
                        </Typography>
                    </Navbar>
                    <Container maxWidth="lg" style={{padding: 10}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <Sidebar onChange={this.changePage} userGroup={userInfo.userGroup}></Sidebar>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Page page={page} index={0} title='Account'>
                                    <UserDashboard userInfo={userInfo} />
                                </Page>
                                <Page page={page} index={1} title='Projects'>
                                    <ProjectManagement />
                                </Page>
                                {userInfo.userGroup == 0 &&
                                    <React.Fragment>
                                        <Page page={page} index={2} title='User Management'><UserManagement /></Page>
                                        <Page page={page} index={3} title='System Management'>Nothin to see here yet :)</Page>
                                    </React.Fragment>
                                }
                            </Grid>
                        </Grid>
                    </Container>
                    <Footer />
                </React.Fragment>
            );
        }
    }
}