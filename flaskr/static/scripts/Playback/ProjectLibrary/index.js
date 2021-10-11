import React, { Fragment } from 'react';
import { forwardRef } from 'react';
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Tile, { Body } from "./tile";
import BackupIcon from '@material-ui/icons/Backup';
import EditIcon from '@material-ui/icons/Edit';
import MaterialTable, { MTableBody } from 'material-table';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import CheckIcon from '@material-ui/icons/Check';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import RefreshIcon from '@material-ui/icons/Refresh';

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


// var tbodyClass = {
//     display: flex;
//     flex-wrap: wrap;
//     width: 100%;
// }
// first tr of the FilterListflex: 9;
// width: 100%;
// flex-grow: 9;
// flex-basis: 100%;

// the othrer tr  
// tbody tr {
//     flex: 1;
//     width: calc(100% / 9 );
// }

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

// Icons end


export default class ProjectLibrary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            tableLayout: "thumbnail",
            filtering: false
        };
        this.playClip = this.playClip.bind(this);
        this.changeTableLayout = this.changeTableLayout.bind(this);
        this.toggleFiltering = this.toggleFiltering.bind(this);
        this.updateProjectLibrary = this.updateProjectLibrary.bind(this);
    }

    componentDidMount() {
        this.updateProjectLibrary()
    }

    updateProjectLibrary() {
        fetch("../api/get_CovideoLibrary/" + window.project.id, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                access_token: localStorage.getItem("access_token"),
                project_token: localStorage.getItem("project_token")
            })
        })
            .then(
                (res) => {
                    if (res.status == 200) {
                        return res.json();
                    }
                    else {
                        window.location.replace('/auth/login/' + window.project.id)
                    }
                }
            )
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        items: result
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

    

    playClip(e, item) {
        window.location.href = '#player';
        this.props.PlayClip(item)
    }

    changeTableLayout(event, value) {
        this.setState({
            tableLayout: value
        });
    }

    toggleFiltering() {
        this.setState({
            filtering: !this.state.filtering
        });

    }


    render() {
        const items = this.state.items;
        const layout = this.state.tableLayout;
        const filtering = this.state.filtering;
        const props = this.props;

        const videoResource = (playbackfile) => {
            if (playbackfile != "") {
                return <PlayCircleOutlineIcon />
            }
            else {
                return ""
            }
        }
        const stillsResource = (stills) => {
            if (stills.length == 1) {
                return <InsertPhotoIcon />
            }
            else if (stills.length > 1) {
                return <PhotoLibraryIcon />
            }
            else {
                return ""
            }
        }
        var components = {}
        if (layout == 'thumbnail') {
            components = {
                Body: props => (<Body isFullscreen={this.props.isFullscreen} {...props}></Body>),
                Row: props => (<Tile {...props} ></Tile>)
            };
        }
        return (
            <Fragment>
                <div style={{ maxWidth: "100%" }}>
                    <MaterialTable
                        style={{
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            display: "block"
                        }}
                        icons={tableIcons}
                        size="small"
                        columns={[
                            { title: 'Thumbnail', field: 'thumbnail', sorting: false, filtering: false, hidden: (layout != "thumbnail-list"), render: rowData => <div className="thumbnail-list" style={{ backgroundImage: "url(" + rowData.thumbnail + ")" }}></div> },
                            { title: 'Scene', field: 'scene' },
                            { title: 'Shot', field: 'shot' },
                            { title: 'Take', field: 'take' },
                            { title: 'Clipname', field: 'clipname' },
                            { title: 'Res.', field: 'resources', hidden: (layout == "thumbnail"), sorting: false, filtering: false, render: rowData => <Fragment>{videoResource(rowData.playbackfile)}{stillsResource(rowData.stills)}</Fragment> },
                            { title: 'Cam', field: 'camera', render: rowData => <span className={"camera" + rowData.camera}>{rowData.camera}</span> },
                            { title: 'Reel', field: 'reel' },
                            { title: 'Label', field: 'label', render: rowData => <div className={"badge " + rowData.label}>{rowData.label}</div> }
                        ]}
                        data={items}
                        title={
                            <Grid container alignItems='center' style={{ width: 'fit-content', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 4 }}>
                                <ToggleButtonGroup exclusive onChange={this.changeTableLayout} value={layout} size="small" >
                                    <ToggleButton style={{ border: 'none' }} value="thumbnail"><ViewModuleIcon /></ToggleButton>
                                    <ToggleButton style={{ border: 'none' }} value="list"><ViewHeadlineIcon /></ToggleButton>
                                    <ToggleButton style={{ border: 'none', borderRadius: 0 }} value="thumbnail-list"><ViewListIcon /></ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButton
                                    value="filtering"
                                    size="small"
                                    style={{ border: 'none', borderRadius: 0 }}
                                    selected={filtering}
                                    onChange={() => {
                                        this.toggleFiltering();
                                    }}
                                >
                                    Filtering <CheckIcon />
                                </ToggleButton>
                                <ToggleButton onClick={this.updateProjectLibrary} size="small" style={{ border: 'none', borderRadius: 0 }}>
                                    <RefreshIcon />
                                </ToggleButton>
                            </Grid>}

                        onRowClick={this.playClip}
                        options={{
                            paging: true,
                            pageSize: 24,       // make initial page size
                            emptyRowsWhenPaging: false,   //to make page size fix in case of less data rows
                            pageSizeOptions: [12, 24, 48, 96],    // rows selection options
                            filtering: filtering,
                            filterRowStyle: {
                                width: "100%",
                                flexGrow: 9,
                                flexBasis: "100%",
                                width: "100%"
                            },
                            rowStyle: {
                                flex: 1,
                                width: "calc(100% / 9 )"
                            },
                            headerStyle: {
                                backgroundColor: 'transparent',
                                padding: 6
                            },
                            cellStyle: {
                                padding: '6px',
                            }

                        }}
                        components={components}

                    />

                </div>

                {props.writePermission == true &&
                    <ButtonGroup mt={5} color="primary" variant="contained" aria-label="contained primary button group">
                        <Button startIcon={<BackupIcon />} href={"/viewer/" + window.project.id + "/upload"}>Upload</Button>
                        <Button startIcon={<EditIcon />} href={"/viewer/" + window.project.id + "/meta"} >Meta Editor</Button>
                    </ButtonGroup>
                }
                

            </Fragment>
        );
    }


}