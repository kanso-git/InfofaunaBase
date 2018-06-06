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
import { translate, Trans } from 'react-i18next';

import axios from '../../axios-infofauna';
import cssUsers from './Users.css';

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

class Users extends Component {
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
    console.log(`handleOpen :: open the details of user with id:${id}`);
    this.props.history.push('/users/' + id);
  };

  handleFiltered = e => {
    const filtered = e.target.value;
    this.filtered = filtered;
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

  requestData = async reqParam => {
    const res = await axios.get(`/api/users/?${reqParam}`);
    return res;
  };

  fetchData = async (state, instance) => {
    const requestParams = this.createRequestParams(
      state.pageSize,
      state.page,
      state.sorted,
      this.filtered ? this.filtered : ''
    );

    this.setState(prevState => ({
      loading: true,
      sorted: state.sorted,
      pageSize: state.pageSize,
      page: state.page
    }));

    // Request the data however you want.  Here, we'll use our mocked service we created earlier

    const res = await this.requestData(requestParams);

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
    const {t,i18n } = this.props;
    const { data, pages, loading } = this.state;
    return (
      <div className={cssUsers.PersonsContainer}>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            Gestion des utilisateurs
          </Typography>
          <Typography component="p">
            Gestion des utilisateurs, ajouter, modifier et supprimer
          </Typography>

          <TextField
            id="name"
            label="Filtrer par nom d'utilisateur"
            className={classes.textField}
            value={this.state.filtered}
            onChange={this.handleFiltered}
            margin="normal"
          />
          <div style={{ float: 'right' }}>
            <Tooltip id="tooltip-fab" title="Ajouter une nouveau utilisateur">
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
                Header: 'Utilisateur',

                columns: [
                  {
                    Header: 'Login',
                    accessor: 'username',
                    maxWidth: 150
                  },
                  {
                    Header: 'Personne',
                    accessor: 'person',
                    Cell: row => (
                      <div>
                        {row.value
                          ? `${row.value.firstName} ${row.value.lastName}`
                          : ''}
                      </div>
                    )
                  }
                ]
              },

              {
                Header: 'Authentification',
                columns: [
                  {
                    Header: 'LDAP',
                    accessor: 'ldap',
                    sortable: false,
                    maxWidth: 200,
                    Cell: row => (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#dadada',
                          borderRadius: '2px'
                        }}
                      >
                        <div
                          style={{
                            width: `${row.value * 100}%`,
                            height: '100%',
                            backgroundColor:
                              row.value > 66
                                ? '#85cc00'
                                : row.value > 33
                                  ? '#ffbf00'
                                  : '#85cc00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out'
                          }}
                        />
                      </div>
                    )
                  }
                ]
              }
            ]}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            data={data ? data : []}
            pages={pages ? pages : -1} // Display the total number of pages
            loading={loading} // Display the loading overlay when we need it
            onFetchData={(state, instance) => {
              return this.fetchData(state, instance);
            }} // Request new data when things change
            filterable
            defaultPageSize={10}
            className="-striped -highlight"
            defaultSorted={[
              {
                id: 'username',
                desc: false
              }
            ]}
            filterable={false}
            previousText={t('Table Previous')}
            nextText={t('Table Next')}
            loadingText={t('Table Loading')}
            noDataText={t('Table No rows found')}
            pageText={t('Table Page')}
            ofText={t('Table Of')}
            rowsText={t('Table Rows')}
          />
        </Paper>
        <br />
      </div>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(translate('translations')(Users));
