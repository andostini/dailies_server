import React from "react"
import { Paper, Link, Grid, Typography, Container } from '@material-ui/core';
import { } from '@material-ui/icons'

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

export default class Navbar extends React.Component {
    render() {
        return (
            <Paper className='footer'>
                <Container fixed>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                        <Grid item xs={6} md={4}>
                            <Typography variant="h6" style={{ fontFamily: 'Tangerine', fontSize: '42px', fontWeight: '600', display: 'inline' }}>
                                fade
                        </Typography>
                            <Typography variant="subtitle1" style={{ fontSize: '17px', fontWeight: '200', display: 'inline' }}>
                                / dailies & livestream
                        </Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <p>Seen a bug or require a feature? Please get in touch with us!</p>
                            <p>This is fade / dailies server v0.3 developed by Fabian Decker and Vincent Zettl</p>
                        </Grid>
                        <Grid item xs={6} md={4} >
                            <ul style={{listStyle: 'none', fontSize: 16}}>
                                <li><Link href="/">Home</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                            </ul>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>)
    }
}