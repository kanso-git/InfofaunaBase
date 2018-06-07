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
import cssProjects from './Projects.css';
import { projectActions } from '../../store/actions';
import { connect } from 'react-redux';
import * as types from '../../store/actions/Types';
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

class Projects extends Component {
  state = {
    data: [],
    pages: null,
    loading: true,
    searchCodeName: '',
    searchInstitutionName: ''
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
    console.log(`handleOpen :: open the details of project with id:${id}`);
    this.props.history.push('/projects/' + id);
  };

    handleNew = () => {
        this.props.prepareForm();
        this.props.history.push('/projects/new');
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
  handleFiltered = (key, e) => {
    const filtered = e.target.value;
    this.filtered = { [key]: filtered };
    this.updatedState = { ...this.state, [key]: filtered, page: 0 };
    this.setState(() => ({
      [key]: filtered,
      page: 0
    }));

    this.fetchData(this.updatedState);
  };

  // pageSize=20&page=1&orderBy=designation&sortOrder=asc&searchCodeName=Biodiv&searchInstitutionName=AQUABUG

  requestData = async (
    pageSize,
    page = 1,
    sorted,
    searchCodeName,
    searchInstitutionName
  ) => {
    const params = {
      pageSize,
      page: page + 1,
      orderBy: sorted[0].id,
      sortOrder: sorted[0].desc ? 'desc' : 'asc',
      searchCodeName,
      searchInstitutionName
    };
    const reqParam = Object.keys(params)
      .map(k => `${k}=${params[k]}`)
      .join('&');
    console.log(reqParam);
    const res = await axios.get(`/api/projects/?${reqParam}`);
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
      this.updatedState ? this.updatedState.searchCodeName : '',
      this.updatedState ? this.updatedState.searchInstitutionName : ''
    );

    const filteredKey = this.filtered ? Object.keys(this.filtered)[0] : '';
    const filteredFor = this.getParamByNameFormUrl(
      filteredKey,
      res.request.responseURL
    );

    if (
      (filteredFor || filteredKey) &&
      filteredFor !== this.filtered[filteredKey]
    ) {
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
    const { t, i18n } = this.props;
    const { classes } = this.props;
    const { data, pages, loading } = this.state;
    return (
      <div className={cssProjects.PersonsContainer}>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
              {t('Project Projects management')}
          </Typography>
          <Typography component="p">
              {t('Project Management, add, edit and delete')}
          </Typography>

          <TextField
            id="name"
            label={t('Project Filter by code or name')}
            className={classes.textField}
            value={this.state.searchCodeName}
            onChange={event => this.handleFiltered('searchCodeName', event)}
            margin="normal"
          />

          <TextField
            id="name"
            label={t('Project Filter by institution')}
            className={classes.textField}
            value={this.state.searchInstitutionName}
            onChange={event =>
              this.handleFiltered('searchInstitutionName', event)
            }
            margin="normal"
          />

          <div style={{ float: 'right' }}>
            <Tooltip id="tooltip-fab" title={t('Project Add new project')}>
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
                Header: t('Project Project'),

                columns: [
                  {
                    Header:  t('Project Code IFF'),
                    accessor: 'code',
                    maxWidth: 150
                  },
                  {
                    Header: t('Project Name'),
                    accessor: 'designation'
                  },
                  {
                    Header: t('Project Type'),
                    accessor: 'projectTypeI18n',
                    maxWidth: 150,
                    sortable: false
                  }
                ]
              },

              {
                Header:  t('Project Institution'),
                columns: [
                  {
                    Header:  t('Project Mandating institution'),
                    accessor: 'principalInstitution.name',
                    sortable: false,
                    maxWidth: 300
                  },
                  {
                    Header:  t('Project Mandatory institution'),
                    accessor: 'mandataryInstitution.name',
                    sortable: false,
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
            filterable
            defaultPageSize={10}
            className="-striped -highlight"
            defaultSorted={[
              {
                id: 'designation',
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

Projects.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps =(state) => ({
    opreationType: state.project.opreationType
})

export default connect(mapStateToProps, { ...projectActions })(
  withStyles(styles)(translate('translations')(Projects))
);
