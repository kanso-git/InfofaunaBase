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
import 'react-table/react-table.css';
import { translate, Trans } from 'react-i18next';
import axios from '../../axios-infofauna';
import cssPersons from './Persons.css';
import {personActions, thesaurusActions} from '../../store/actions';
import { connect } from 'react-redux';
import * as types from '../../store/actions/Types';
import * as authHelper from '../../store/actions/AuthHelper';
import withErrorHandler from "../withErrorHandler/withErrorHandler";

const NotificationSystem = require('react-notification-system');

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

  componentDidMount(){
      this.notificationInput = React.createRef();
     if(this.props.opreationType && this.props.opreationType === types.DELETE_OPREATION_TYPE){
       const { t } = this.props;
       setTimeout(()=>this.addNofification(
           t('Notification Body delete success'),
           t('Notification Title success'),
           'success'
       ), 200);
       this.props.prepareForm();

     }
  }

  getParamByNameFormUrl = (name, url) => {
    if (
      (name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(
        url
      ))
    )
      return decodeURIComponent(name[1]);
  };
  handleOpen = id => {
    console.log(`handleOpen :: open the details of person with id:${id}`);
    this.props.history.push('/persons/' + id);
  };

    handleNew = () => {
        this.props.prepareForm();
        this.props.history.push('/persons/new');
    };

    addNofification = (message, title, level)=>{
        if(this.notificationInput.current){
            this.notificationInput.current.addNotification({
                title: title,
                message: message,
                level: level,
                position: 'tr'
            });
        }
    }
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
      this.filtered ? this.filtered : ''
    );

    this.setState(() => ({
      loading: true,
      sorted: state.sorted,
      pageSize: state.pageSize,
      page: state.page
    }));

    try{
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
    }catch(e){
      console.log(e)

    }
  };

  render() {
    const { t, i18n } = this.props;
    const { classes } = this.props;
    const { data, pages, loading } = this.state;
    return (
      <div className={cssPersons.PersonsContainer}>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
              {t('Person Persons management')}
          </Typography>
          <Typography component="p">
              {t('Person Person management, add, edit and delete')}
          </Typography>

          <TextField
            id="name"
            label=  {t('Person Filter by first or last name')}
            className={classes.textField}
            value={this.state.filtered}
            onChange={this.handleFiltered}
            margin="normal"
          />
            { authHelper.currentUserHasInfofaunaUserPermission() ?
                <div style={{ float: 'right' }}>
                    <Tooltip id="tooltip-fab" title= {t('Person Add new person')}>
                        <Button
                            variant="fab"
                            color="primary"
                            aria-label="add"
                            className={classes.button}
                            onClick={this.handleNew}
                        >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                </div> : null
            }


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
                Header:  t('Person Personal information'),

                columns: [
                  {
                    Header: t('Person Academic title'),
                    accessor: 'titleI18n',
                    sortable: false,
                    maxWidth: 100
                  },
                  {
                    Header: t('Person Lastname'),
                    id: 'lastName',
                    accessor: 'lastName',
                    style: { verticalAlign: 'center' }
                  },
                  {
                    Header: t('Person Firstname'),
                    accessor: 'firstName'
                  },

                  {
                    Header: t('Person Gender'),
                    accessor: 'genderI18n',
                    sortable: false,
                    maxWidth: 100
                  }
                ]
              },

              {
                Header: t('Person Address'),
                columns: [
                  {
                    Header: t('Person Country'),
                    accessor: 'countryI18n',
                    sortable: false,
                    maxWidth: 120
                  },
                  {
                    Header:  t('Person City'),
                    accessor: 'locality',
                    maxWidth: 150
                  },
                  {
                    Header: t('Person E-mail'),
                    accessor: 'email',
                    maxWidth: 300
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
          <NotificationSystem ref={this.notificationInput} />
      </div>
    );
  }
}

Persons.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps =(state) => ({
    opreationType: state.person.opreationType
})


export default connect(mapStateToProps, {
    ...personActions
})(withErrorHandler(withStyles(styles)(translate('translations')(Persons)), axios));

