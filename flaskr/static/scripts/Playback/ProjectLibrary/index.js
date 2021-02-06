import React from 'react';
import { forwardRef } from 'react';
import { Grid, Button, ButtonGroup, Box} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import Tile, {Body} from "./tile"; 
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

// Icons end


export default class ProjectLibrary extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            tableLayout: "list",
            filtering: false
        };
        this.playClip = this.playClip.bind(this);
        this.changeTableLayout = this.changeTableLayout.bind(this);
        this.toggleFiltering = this.toggleFiltering.bind(this);
    }
    
    componentDidMount() {
        fetch("../api/get_CovideoLibrary/" + window.project.id, {
            method: "POST"
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                    console.log(result);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    playClip(e,item) {
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
                //Body: props => (<Box><MTableBody {...props} />{console.log('1')}{console.log(props)}</Box>),
                Body: props => (<Body props={props}></Body>),
                Row: props => (<Tile data={props.data} ></Tile>)
            };
        }

        

        return (
            <React.Fragment>
                <div style={{maxWidth: "100%"}}>
                    <MaterialTable
                        style={{
                            backgroundColor: "transparent",
                            boxShadow: "none"
                        }}
                        icons={tableIcons}
                        columns={[
                            { title: 'Thumbnail', field: 'thumbnail', hidden: (layout == "list") , render: rowData =>  <div className="thumbnail-list" style={{backgroundImage: "url(" + rowData.thumbnail +")"}}></div> }, 
                            { title: 'Scene', field: 'scene' }, 
                            { title: 'Shot', field: 'shot' },
                            { title: 'Take', field: 'take' },
                            { title: 'Clipname', field: 'clipname' },
                            { title: 'Res.', field: 'resources' , filtering: false, render: rowData => <React.Fragment>{videoResource(rowData.playbackfile)}{stillsResource(rowData.stills)}</React.Fragment>},
                            { title: 'Cam', field: 'camera', render: rowData => <span className={"camera" + rowData.camera}>{rowData.camera}</span> },
                            { title: 'Reel', field: 'reel' },
                            { title: 'Label', field: 'label', render: rowData => <div className={"badge " + rowData.label}>{rowData.label}</div> }
                        ]}
                        data={items}
                        title = 
                            <React.Fragment>
                                <ToggleButtonGroup exclusive onChange={this.changeTableLayout} value={layout} size="small">
                                    <ToggleButton value="thumbnail"><ViewModuleIcon /></ToggleButton>
                                    <ToggleButton value="list"><ViewHeadlineIcon /></ToggleButton>
                                    <ToggleButton value="thumbnail-list"><ViewListIcon /></ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButton
                                    value="filtering"
                                    size="small"
                                    selected={filtering}
                                    onChange={() => {
                                        this.toggleFiltering();
                                    }}
                                    >
                                    Filtering <CheckIcon />
                                </ToggleButton>
                            </React.Fragment>
                        
                        onRowClick={this.playClip}
                        options={{
                            paging:true,
                            pageSize:10,       // make initial page size
                            emptyRowsWhenPaging: false,   //to make page size fix in case of less data rows
                            pageSizeOptions:[10,20,50,100],    // rows selection options
                            filtering: filtering
                          }}
                          components={components}

                    />

                </div>
                <ButtonGroup mt={5} color="primary" variant="contained" aria-label="contained primary button group">
                    <Button startIcon={<BackupIcon />} href={"/viewer/" + window.project.id + "/upload"}>Upload</Button>
                    <Button startIcon={<EditIcon />} href={"/viewer/" + window.project.id + "/meta"}>Meta Editor</Button>
                </ButtonGroup>

            </React.Fragment>
        );
    }

    
}