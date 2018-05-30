import React, {Component} from 'react';
import ReactTable from "react-table";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';


import axios from '../../axios-infofauna';
import cssProjects from './Projects.css'

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
    buttonExtraSmall: {
        marginLeft: 3,
        marginRight: 3,

    },
    fab: {
        margin: theme.spacing.unit * 2,
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
    },
});


class Projects extends Component {

    state = {
        data: [],
        pages: null,
        loading: true,
        searchCodeName: '',
        searchInstitutionName: ''

    };

    handleFiltered = (key, e) => {
        const filtered = e.target.value;
        const updatedState = {...this.state, [key]:filtered, page: 0};
        this.setState(() => ({
            [key]: filtered,
            page: 0
        }))

        this.fetchData(updatedState);

    }

    // pageSize=20&page=1&orderBy=designation&sortOrder=asc&searchCodeName=Biodiv&searchInstitutionName=AQUABUG

    requestData = async (pageSize, page = 1, sorted, searchCodeName, searchInstitutionName) => {
        const params = {
            pageSize,
            page: page + 1,
            orderBy: sorted[0].id,
            sortOrder: sorted[0].desc ? 'desc' : 'asc',
            searchCodeName,
            searchInstitutionName,
        }
        const reqParam = Object.keys(params).map(k => `${k}=${params[k]}`).join('&');
        console.log(reqParam);
        const res = await axios.get(`/api/projects/?${reqParam}`);
        return res;

    }
    fetchData = async (state, instance) => {
        this.setState({
            loading: true,
            sorted: state.sorted,
            pageSize: state.pageSize,
            page: state.page
        });
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        const res = await this.requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.searchCodeName ? state.searchCodeName : '',
            state.searchInstitutionName ? state.searchInstitutionName : ''
        )
        this.setState({
            data: res.data.rows,
            pages: Math.ceil(res.data.total / state.pageSize),
            loading: false
        });

    }

    render() {
        const {classes} = this.props;
        const {data, pages, loading} = this.state;
        return (
            <div className={cssProjects.PersonsContainer}>
                <Paper className={classes.root} elevation={4}>
                    <Typography variant="headline" component="h3">
                        Gestion des projects
                    </Typography>
                    <Typography component="p">
                        Gestion des projets, ajouter, modifier et supprimer
                    </Typography>


                    <TextField
                        id="name"
                        label="Filtrer par code/nom :"
                        className={classes.textField}
                        value={this.state.searchCodeName}
                        onChange={(event) => this.handleFiltered('searchCodeName', event)}
                        margin="normal"
                    />

                    <TextField
                        id="name"
                        label="Filtrer par institution"
                        className={classes.textField}
                        value={this.state.searchInstitutionName}
                        onChange={(event) => this.handleFiltered('searchInstitutionName', event)}
                        margin="normal"
                    />

                    <div style={{float: 'right'}}>
                        <Tooltip id="tooltip-fab" title="Ajouter une nouvelle personne">
                            <Button variant="fab" color="primary" aria-label="add" className={classes.button}>
                                <AddIcon/>
                            </Button>
                        </Tooltip>
                    </div>

                    <div style={{height: 20}}>

                    </div>
                    <ReactTable
                        getTdProps={(state, rowInfo, column, instance) => {
                            return {
                                onClick: (e, handleOriginal) => {
                                    console.log("A Td Element was clicked!");
                                    console.log("it produced this event:", e);
                                    console.log("It was in this column:", column);
                                    console.log("It was in this row:", rowInfo);
                                    console.log("It was in this table instance:", instance);

                                    // IMPORTANT! React-Table uses onClick internally to trigger
                                    // events like expanding SubComponents and pivots.
                                    // By default a custom 'onClick' handler will override this functionality.
                                    // If you want to fire the original onClick handler, call the
                                    // 'handleOriginal' function.
                                    if (handleOriginal) {
                                        handleOriginal();
                                    }
                                }
                            };
                        }}
                        columns={[
                            {
                                Header: "Projet",

                                columns: [{
                                    Header: "Code IFF",
                                    accessor: "code",
                                    maxWidth: 150,

                                },
                                    {
                                        Header: "Nom",
                                        accessor: "designation",
                                    }
                                    ,

                                    {
                                        Header: "Type",
                                        accessor: "projectTypeI18n",
                                        maxWidth: 150,
                                        sortable: false,

                                    }
                                    ]
                            },

                            {
                                Header: "Institution",
                                columns: [
                                    {
                                        Header: "Mandante",
                                        accessor: "principalInstitution.name",
                                        sortable: false,
                                        maxWidth: 300
                                    },
                                    {
                                        Header: "Mandataire",
                                        accessor: "mandataryInstitution.name",
                                        sortable: false,
                                        maxWidth: 300
                                    }
                                ]
                            },
                            {
                                Header: "Actions",
                                columns: [
                                    {
                                        Header: "",
                                        accessor: "id",
                                        sortable: false,
                                        maxWidth: 120,
                                        Cell: row => (
                                            <div>
                                                <Tooltip id="tooltip-fab" title="Modifier la personne">
                                                    <Button variant="fab" mini aria-label="edit"
                                                            className={classes.buttonExtraSmall}>
                                                        <Icon>edit_icon</Icon>
                                                    </Button>
                                                </Tooltip>

                                                <Tooltip id="tooltip-fab" title="Supprimer la personne">
                                                    <Button variant="fab" color="secondary" mini aria-label="delete"
                                                            className={classes.buttonExtraSmall}>
                                                        <DeleteIcon/>
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        )
                                    }
                                ]
                            }


                        ]}

                        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                        data={data}
                        pages={pages} // Display the total number of pages
                        loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData} // Request new data when things change
                        filterable
                        defaultPageSize={10}
                        className="-striped -highlight"
                        defaultSorted={[
                            {
                                id: "designation",
                                desc: false
                            }
                        ]}
                        filterable={false}

                    />
                </Paper>
                <br/>

            </div>
        );
    }

}

Projects.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Projects);

