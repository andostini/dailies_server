import React from 'react';

import { forwardRef } from 'react';
import { Button, Avatar} from '@material-ui/core';
import Form from './form';

import MaterialTable from 'material-table';
import AddIcon from '@material-ui/icons/Add';


// All Icons for Material Table
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


export default class UserTable extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null,
            isLoaded: false,
        }
        this.update = this.update.bind(this);
    }

    update() {
        fetch("/settings/getUsers", {
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
                        isLoaded: true,
                        users: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    componentDidMount() {
        this.update();
    }

    render() {
        const users = this.state.users;
        const isLoaded = this.state.isLoaded;
        if (isLoaded) {
            return (
                <div style={{ maxWidth: '100%' }} >
                    <MaterialTable
                        title={
                            <Button variant="contained" color="primary" onClick={() => this.props.changeUserInForm('','newUser')}>
                                <AddIcon />
                            </Button>
                        }
                        columns={[
                            { title: 'Avatar', field: 'id', render: rowData => <Avatar src={"/api/images/users/" + rowData.id + ".png"} ></Avatar> },
                            { title: 'ID', field: 'id' },
                            { title: 'Username', field: 'userName' },
                            { title: 'Name', field: 'name' },
                            { title: 'EMail', field: 'eMail' },
                            { title: 'User Group', field: 'userGroup' },
                            { title: 'Avail. Storage', field: 'maxGB' },
                            { title: 'Avail. Projects', field: 'maxProjectNumber' }

                        ]}

                        data={users}
                        icons={tableIcons}
                        size="small"
                        options={{
                            paging: true,
                            pageSize: 10,
                            pageSizeOptions: [10, 20, 50],
                            filtering: true,
                            emptyRowsWhenPaging: false
                        }}
                        onRowClick={this.props.changeUserInForm}
                    >

                    </MaterialTable>
                </div>
            );
        }
        else {
            return (
                <p>Loading</p>
            )
        }
    }
}