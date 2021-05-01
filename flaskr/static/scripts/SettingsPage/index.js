import React from 'react';
import Navbar from "../Navbar";
import Footer from '../Footer';
import Sidebar from './sidebar'
import UserManagement from './UserManagement'
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
            page: 2
        }
        this.changePage = this.changePage.bind(this);
    }

    changePage(val) {
        this.setState({
            page: val
        });
    }

    render() {
        const page= this.state.page;
        console.log(page)
        return(
            <React.Fragment>
                <Navbar> 
                    <Typography variant="subtitle2" align="right">
                        You are logged in as <strong>{window.userName}</strong>
                    </Typography>
                </Navbar>
                <Container maxWidth="lg" style={{padding: 10}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                            <Sidebar onChange={this.changePage}></Sidebar>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Page page={page} index={0} title='Account'>1</Page>
                            <Page page={page} index={1} title='Projects'>2</Page>
                            <Page page={page} index={2} title='User Management'><UserManagement /></Page>
                            <Page page={page} index={3} title='System Management'>4</Page>
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
            </React.Fragment>
        );
    }
}