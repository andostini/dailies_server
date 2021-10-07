import React from 'react';
import { Paper, MenuList, MenuItem, ListItemIcon, Divider, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import PermMediaIcon from '@material-ui/icons/PermMedia';





export default class Sidebar extends React.Component {
    constructor() {
        super();
    }

    render() {
        const userGroup = this.props.userGroup;
        return(
            <Paper>
                <MenuList>
                    <MenuItem onClick={() => this.props.onChange(0)}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Account</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => this.props.onChange(1)}>
                        <ListItemIcon>
                            <PermMediaIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Projects</Typography>
                    </MenuItem>
                    {userGroup == 0 &&
                        <React.Fragment>
                            <Divider />
                            <MenuItem onClick={() => this.props.onChange(2)}>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <Typography variant="inherit">User Management</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => this.props.onChange(3)}>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <Typography variant="inherit">System Management</Typography>
                            </MenuItem>
                        </React.Fragment>
                    }
                </MenuList>
            </Paper>
        );
    }
}