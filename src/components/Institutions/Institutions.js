import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import axios from '../../axios-infofauna';
import cssUsers from './Institutions.css';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
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

class Institutions extends Component {
  state = {
    data: [],
    pages: null,
    loading: true,
    filtered: ''
  };

  getParamByNameFormUrl = (name, url) => {
    if (
      (name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(
        url
      ))
    )
      return decodeURIComponent(name[1]);
  };
  handleOpen = id => {
    console.log(`handleOpen :: open the details of inistitution with id:${id}`);
    this.props.history.push('/institutions/' + id);
  };
  handleFiltered = async e => {
    const filtered = e.target.value;
    this.filtered = filtered;
    const updatedState = { ...this.state, filtered, page: 0 };
    this.setState(() => ({
      filtered,
      page: 0
    }));

    this.fetchData(updatedState);
  };

  //  //api/projects/?pageSize=20&page=1&orderBy=designation&sortOrder=asc
  requestData = async (pageSize, page = 1, sorted, filtered) => {
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
    console.log(reqParam);
    const res = await axios.get(`/api/institutions/?${reqParam}`);
    return res;
  };
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
      state.filtered ? state.filtered : ''
    );
    const filteredFor = this.getParamByNameFormUrl(
      'search',
      res.request.responseURL
    );
    if ((filteredFor || this.filtered) && filteredFor !== this.filtered) {
      this.setState(() => ({
        loading: false
      }));
    } else {
      this.setState(() => ({
        data: res.data.rows,
        pages: Math.ceil(res.data.total / state.pageSize),
        loading: false
      }));
    }
  };

  render() {
    const { classes } = this.props;
    const { data, pages, loading } = this.state;
    return (
      <div className={cssUsers.PersonsContainer}>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            Gestion des institutions
          </Typography>
          <Typography component="p">
            Gestion des Institutions, ajouter, modifier et supprimer
          </Typography>

          <TextField
            id="name"
            label="Filtrer par Abbréviation/Nom"
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
                onClick: e => {
                  if (rowInfo) {
                    this.handleOpen(rowInfo.row._original.id);
                  }
                }
              };
            }}
            columns={[
              {
                Header: 'Institution',

                columns: [
                  {
                    Header: 'Abbréviation',
                    accessor: 'acronym',
                    maxWidth: 150
                  },
                  {
                    Header: 'Nom',
                    id: 'name',
                    accessor: 'name'
                  }
                ]
              },

              {
                Header: 'Adresse',
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
                id: 'name',
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

Institutions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Institutions);
