import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import ExplorIcon from '@material-ui/icons/Explore';
import Tooltip from '@material-ui/core/Tooltip';

import axios from '../../axios-infofauna';
import cssPersons from './Persons.css';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    margin: theme.spacing.unit
  },
  buttonExtraSmall: {
    marginLeft: 3,
    marginRight: 3
  },
  fab: {
    margin: theme.spacing.unit * 2
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3
  }
});

let savedRequestParams = null;

class Persons extends Component {
  state = {
    data: [],
    pages: null,
    loading: true,
    filtered: ''
  };

  handleFiltered = async e => {
    const filtered = e.target.value;
    const updatedState = { ...this.state, filtered, page: 0 };
    this.setState(() => ({
      filtered,
      page: 0
    }));

    this.fetchData(updatedState);
  };

  createRequestParams = (pageSize, page = 1, sorted, filtered) => {
    const params = {
      pageSize,
      page: page + 1,
      orderBy: sorted[0].id,
      sortOrder: sorted[0].desc ? 'desc' : 'asc',
      search: filtered
    };
    const reqParam = Object.keys(params)
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return reqParam;
  };
  //  //api/projects/?pageSize=20&page=1&orderBy=designation&sortOrder=asc
  requestData = async reqParam => {
    const res = await axios.get(`/api/persons/?${reqParam}`);
    return res;
  };
  fetchData = async (state, instance) => {
    const requestParams = this.createRequestParams(
      state.pageSize,
      state.page,
      state.sorted,
      state.filtered ? state.filtered : ''
    );

    this.setState(() => ({
      loading: true,
      sorted: state.sorted,
      pageSize: state.pageSize,
      page: state.page
    }));
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    const res = await this.requestData(requestParams);

    this.setState(() => ({
      data: res.data.rows,
      pages: Math.ceil(res.data.total / state.pageSize),
      loading: false
    }));
  };

  render() {
    const { classes } = this.props;
    const { data, pages, loading } = this.state;
    return (
      <div className={cssPersons.PersonsContainer}>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            Gestion des personnes
          </Typography>
          <Typography component="p">
            Gestion des personnes, ajouter, modifier et supprimer
          </Typography>

          <TextField
            id="name"
            label="Filtrer par nom ou prénom"
            className={classes.textField}
            value={this.state.filtered}
            onChange={this.handleFiltered}
            margin="normal"
          />
          <div style={{ float: 'right' }}>
            <Tooltip id="tooltip-fab" title="Ajouter une nouvelle personne">
              <Button
                variant="fab"
                color="primary"
                aria-label="add"
                className={classes.button}
              >
                <AddIcon />
              </Button>
            </Tooltip>
          </div>

          <div style={{ height: 20 }} />
          <ReactTable
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  console.log('A Td Element was clicked!');
                  console.log('it produced this event:', e);
                  console.log('It was in this column:', column);
                  console.log('It was in this row:', rowInfo);
                  console.log('It was in this table instance:', instance);

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
                Header: 'Nom',

                columns: [
                  {
                    Header: 'Titre académique',
                    accessor: 'titleI18n',
                    sortable: false,
                    maxWidth: 100
                  },
                  {
                    Header: 'Nom',
                    id: 'lastName',
                    accessor: 'lastName',
                    style: { verticalAlign: 'center' }
                  },
                  {
                    Header: 'Prénom',
                    accessor: 'firstName'
                  },

                  {
                    Header: 'Genre',
                    accessor: 'genderI18n',
                    sortable: false,
                    maxWidth: 100
                  }
                ]
              },

              {
                Header: 'Info',
                columns: [
                  {
                    Header: 'Pays',
                    accessor: 'countryI18n',
                    sortable: false,
                    maxWidth: 120
                  },
                  {
                    Header: 'Localité',
                    accessor: 'locality',
                    maxWidth: 150
                  },
                  {
                    Header: 'E-mail',
                    accessor: 'email',
                    maxWidth: 300
                  }
                ]
              },
              {
                Header: 'Actions',
                columns: [
                  {
                    Header: '',
                    accessor: 'id',
                    sortable: false,
                    maxWidth: 120,
                    Cell: row => (
                      <div>
                        <Tooltip id="tooltip-fab" title="Modifier la personne">
                          <Button
                            variant="fab"
                            mini
                            aria-label="edit"
                            className={classes.buttonExtraSmall}
                          >
                            <Icon>edit_icon</Icon>
                          </Button>
                        </Tooltip>

                        <Tooltip id="tooltip-fab" title="Supprimer la personne">
                          <Button
                            variant="fab"
                            color="secondary"
                            mini
                            aria-label="delete"
                            className={classes.buttonExtraSmall}
                          >
                            <DeleteIcon />
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
            defaultPageSize={10}
            className="-striped -highlight"
            defaultSorted={[
              {
                id: 'firstName',
                desc: false
              }
            ]}
            filterable={false}
          />
        </Paper>
        <br />
      </div>
    );
  }
}

Persons.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Persons);
