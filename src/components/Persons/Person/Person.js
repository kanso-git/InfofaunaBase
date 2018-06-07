import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik } from 'formik';
import { object, string } from 'yup';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Delete from '@material-ui/icons/Delete';
import Save from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { translate, Trans } from 'react-i18next';
import moment from '../../../moment-local';
import './Person.css';
import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';
import axios from '../../../axios-infofauna';
import { personActions, thesaurusActions } from '../../../store/actions';
import * as types from '../../../store/actions/Types';
import { NavLink, Redirect } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Audit from "../../Audit/Audit";
import Dialog from '../../Dialog/Dialog';
const NotificationSystem = require('react-notification-system');



const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  formControl: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
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
  },
  backLink: {
    color: '#3266cc',
    textDecoration: 'none'
  },
  actualSite: {
    color: '#777'
  }
});

let Person_FirstName_is_required;
let Person_LastName_is_required;
let Person_Gendre_is_required;
let Person_Language_is_required ;
let Person_Country_is_required;
let Person_Phone_format_is_not_valid;
let Person_Email_format_is_not_valid;

class Person extends Component {
  state = {
       enableEditMode: false,
       loading:false
  };


  componentDidMount() {
    console.log('componentDidMount .............');
    this.notificationInput = React.createRef();
    const { id } = this.props.match.params;

    if (id && !this.props.person.ongoingRequest && this.isNotTheSame()) {
      this.props.initiateRequestPerson();
      this.loadAdditionalData();
      this.props.fetchPerson(id);
    }else if(!id){
         this.setState(()=>({
             enableEditMode: true,
             loading: true
         }))
        this.loadAdditionalData();
        this.setState(()=>({
            loading: false
        }))
    }
  }


  loadAdditionalData = ()=> {
    if (!this.props.thesaurus[types.REALM_COUNTRY]) {
        this.props.fetchThesaurus(types.REALM_COUNTRY);
    }
    if (!this.props.thesaurus[types.REALM_GENDER]) {
        this.props.fetchThesaurus(types.REALM_GENDER);
    }
    if (!this.props.thesaurus[types.REALM_TITLE]) {
        this.props.fetchThesaurus(types.REALM_TITLE);
    }
    if (!this.props.thesaurus[types.REALM_LANGUAGE]) {
        this.props.fetchThesaurus(types.REALM_LANGUAGE);
    }
  }

  isNotTheSame =()=>{
      if(this.props.person.data ){
        const { id } = this.props.match.params;
        if(this.props.person.data.id === parseInt(id)){
            return false
        }
      }
      return true;
  }
  componentWillReceiveProps(nextProps){
    console.log('componentWillReceiveProps .............');
    if( nextProps.person.opreationType === types.ADD_OPREATION_TYPE ){
          const {id} = nextProps.match.params;
          if(id && id != this.props.match.params.id){
              this.props.fetchPerson(id);
          }else if(!id){
              const { t } = this.props;
              this.addNofification(
                  t('Notification Body add success'),
                  t('Notification Title success'),
                  'success');
          }

    }

    if(nextProps.person.opreationType === types.MODIFY_OPREATION_TYPE){
       const { t } = this.props;
       this.addNofification(
           t('Notification Body modify success'),
           t('Notification Title success'),
           'success')
    }
  }

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
  handleEnableEditMode = () => {
    this.setState(prevState => ({ enableEditMode: !prevState.enableEditMode }));
  };

  handleDelete = (id) =>{
      this.props.deletePerson(id);
      setTimeout(()=>this.props.history.push('/persons'), 200);
  }
  render() {
    const { classes } = this.props;
    const {t,i18n } = this.props;

    const {
      values,
      errors,
      touched,
      dirty,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      isValid,
      thesaurus,
        person
    } = this.props;
      Person_FirstName_is_required =t('Person FirstName is required');
      Person_LastName_is_required =t('Person LastName is required');
      Person_Gendre_is_required =t('Person Gendre is required');
      Person_Language_is_required =t('Person Language is required');
      Person_Country_is_required =t('Person Country is required');
      Person_Phone_format_is_not_valid =t('Person Phone format is not valid');
      Person_Email_format_is_not_valid =t('Person Email format is not valid');

    let auditData={};
    if(person.data){
        auditData={...person.data.auditDTO}
    }

    if (this.props.person.ongoingRequest || this.state.loading){
      return (
        <div className="ProjectContainer">
          <Paper className={classes.root} elevation={4}>
            <Typography variant="headline" component="h3">
                {t('Person Loading Person')}
            </Typography>
            <br />
            <br />
            <div className={{ flexGrow: 1 }}>
              <LinearProgress />
              <br />
              <LinearProgress color="secondary" />
            </div>
          </Paper>
        </div>
      );
    }

    return (
      <div className="PersonContainer">
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            <NavLink to="/persons" className={classes.backLink}>
                {t('Person Persons')}
            </NavLink> >
              {this.props.match.params.id ?
                  <span className={classes.actualSite}> {t('Person Person Detail')}</span>
                  :  <span className={classes.actualSite}> {t('Person Person New')}</span> }

          </Typography>

          <div style={{ float: 'right' }}>
            <Tooltip id="tooltip-fab" title={t('Form Enable edit mode')}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.enableEditMode}
                    onChange={this.handleEnableEditMode}
                    value="enableEditMode"
                    color="primary"
                  />
                }
                label= {t('Form Enable edit mode')}
              />
            </Tooltip>
          </div>
            { this.props.match.params.id ?  <Audit {...auditData}/> :''}
          <Form>
            <br />
            <Paper className={classes.root} elevation={1}>
              <Typography component="p">  {t('Person Personal information')}</Typography>

              <FormControl
                className={classes.formControl}
                error={touched.title && errors.title ? true : false}
              >
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="select-title-native"
                  select
                  label= {t('Person Academic title')}
                  name="titleId"
                  className={classes.textField}
                  style={{ width: 150 }}
                  value={values.titleId}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                  <option value="-1"> </option>
                  {thesaurus[types.REALM_TITLE] &&
                    thesaurus[types.REALM_TITLE].map(option => (
                      <option key={option.id} value={option.codeValue}>
                        {option.designation}
                      </option>
                    ))}
                </TextField>
              </FormControl>

              <FormControl
                className={classes.formControl}
                error={touched.firstName && errors.firstName ? true : false}
              >
                <InputLabel htmlFor="firstName">*{t('Person Firstname')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="firstName"
                  type="input"
                  name="firstName"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                />
                {touched.firstName &&
                  errors.firstName && (
                    <FormHelperText id="firstName-text">
                      {errors.firstName}
                    </FormHelperText>
                  )}
              </FormControl>

              <FormControl
                className={classes.formControl}
                error={touched.lastName && errors.lastName ? true : false}
              >
                <InputLabel htmlFor="lastName">*{t('Person Lastname')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="lastName"
                  type="input"
                  name="lastName"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                />
                {touched.lastName &&
                  errors.lastName && (
                    <FormHelperText id="firstName-text">
                      {errors.lastName}
                    </FormHelperText>
                  )}
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="select-gender-native"
                  name="genderId"
                  select
                  label={t('Person Gendre')}
                  className={classes.textField}
                  style={{ width: 150 }}
                  value={values.genderId}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                    <option value="-1"> </option>
                  {thesaurus[types.REALM_GENDER] ? (
                    thesaurus[types.REALM_GENDER].map(option => (
                      <option key={option.id} value={option.codeValue}>
                        {option.designation}
                      </option>
                    ))
                  ) : (
                    <option value="-1" />
                  )}
                </TextField>
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="select-language-native"
                  name="languageId"
                  select
                  label ={t('Person Language')}
                  className={classes.textField}
                  style={{ width: 150 }}
                  value={values.languageId}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                    <option value="-1"> </option>
                  {thesaurus[types.REALM_LANGUAGE] ? (
                    thesaurus[types.REALM_LANGUAGE].map(option => (
                      <option key={option.id} value={option.codeValue}>
                        {option.designation}
                      </option>
                    ))
                  ) : (
                    <option value="-1" />
                  )}
                </TextField>
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="date"
                  label=  {t('Person Date of birth')}
                  name="dateOfBirth"
                  type="date"
                  onChange={handleChange}
                  className={classes.textField}
                  value={values.dateOfBirth}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </FormControl>
            </Paper>

            <Paper className={classes.root} elevation={1}>
              <Typography component="h4">{t('Person Address')}</Typography>

              <FormControl
                className={classes.formControl}
                error={touched.address1 && errors.address1 ? true : false}
              >
                <InputLabel htmlFor="address1">{t('Person Street and number')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="address1"
                  type="input"
                  name="address1"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address1}
                />
              </FormControl>

              <FormControl
                className={classes.formControl}
                error={touched.address2 && errors.address2 ? true : false}
              >
                <InputLabel htmlFor="address2">{t('Person Additional information')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="address2"
                  type="input"
                  name="address2"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address2}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="zipCode">{t('Person Postal code')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="zipCode"
                  type="input"
                  name="zipCode"
                  style={{ width: 150 }}
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.zipCode}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="locality">{t('Person City')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="locality"
                  type="input"
                  name="locality"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.locality}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="select-pays-native"
                  name="countryId"
                  select
                  label={t('Person Country')}
                  className={classes.textField}
                  style={{ width: 150 }}
                  value={values.countryId}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                    <option value=""> </option>
                  {thesaurus[types.REALM_COUNTRY] ? (
                    thesaurus[types.REALM_COUNTRY].map(option => (
                      <option key={option.id} value={option.codeValue}>
                        {option.designation}
                      </option>
                    ))
                  ) : (
                    <option value="-1" />
                  )}
                </TextField>
              </FormControl>
            </Paper>

            <Paper className={classes.root} elevation={1}>
              <Typography component="p">{t('Person Contact informations')}</Typography>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="proPhone">
                    {t('Person Professional phone')}
                </InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="proPhone"
                  type="input"
                  name="proPhone"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.proPhone}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="mobilePhone">{t('Person Mobile phone')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="mobilePhone"
                  type="input"
                  name="mobilePhone"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mobilePhone}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="privatePhone"> {t('Person Private phone')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="privatePhone"
                  type="input"
                  name="privatePhone"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.privatePhone}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="email">{t('Person E-mail')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="email"
                  type="email"
                  name="email"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
              </FormControl>
            </Paper>

            <br />

            {this.state.enableEditMode && (
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <Button
                  className={classes.button}
                  variant="raised"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  size="small"
                >
                  <Save className={classNames(classes.rightIcon)} />
                    &nbsp; &nbsp;{t('Person Save')}
                </Button>
                  { this.props.match.params.id
                      ?
                      <Button
                          className={classes.button}
                          variant="raised"
                          color="secondary"
                          onClick={() => this.setState(()=>({dialog: true})) }
                      >
                          {t('Person Delete')}
                          <Delete className={classes.rightIcon} />
                      </Button> :
                    ''
                  }

              </div>
            )}
          </Form>
        </Paper>
          <NotificationSystem ref={this.notificationInput} />
          {this.state.dialog ?
              <Dialog handleClose={() => this.setState(()=>({dialog: false})) } handleDelete={()=> this.handleDelete(this.props.match.params.id)}/> : null
          }
      </div>
    );
  }
}

const PersonForm = withFormik({
  // we can passe the default values props from the parent component - useful for edit
  enableReinitialize: true,

  mapPropsToValues(props) {
    const { firstName, lastName, username, password, person } = props;

    return {
      titleId: person.data && person.data.titleId ? person.data.titleId : '',
      firstName:
        person.data && person.data.firstName ? person.data.firstName : '',
      lastName: person.data && person.data.lastName ? person.data.lastName : '',

      genderId: person.data && person.data.genderId ? person.data.genderId : '',
      languageId:
        person.data && person.data.languageId ? person.data.languageId :'',
      dateOfBirth:
        person.data && person.data.dateOfBirth
          ? moment(person.data.dateOfBirth).format('YYYY-MM-DD')
          : '',
      address1: person.data && person.data.address1 ? person.data.address1 : '',
      address2: person.data && person.data.address2 ? person.data.address2 : '',
      zipCode: person.data && person.data.zipCode ? person.data.zipCode : '',
      locality: person.data && person.data.locality ? person.data.locality : '',
      countryId:
        person.data && person.data.countryId ? person.data.countryId : '',
      proPhone: person.data && person.data.proPhone ? person.data.proPhone : '',
      mobilePhone:
        person.data && person.data.mobilePhone ? person.data.mobilePhone : '',
      privatePhone:
        person.data && person.data.privatePhone ? person.data.privatePhone : '',
      email: person.data && person.data.email ? person.data.email : ''
    };
  },
  async handleSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
      console.log(JSON.stringify(values, null,3));
      if(props.match.params.id){
          const { id } = props.match.params;
          await props.updatePerson(id, values);
          await props.fetchPerson(id);
          setSubmitting(false);
      }else{
          const response= await props.addNewPerson(values);
          setTimeout(()=>props.history.push(response.headers.location), 200);
      }

  },
  isInitialValid: (props)=> props.match.params.id ? true:false,
  validationSchema: () => object().shape({
    firstName: string().required(Person_FirstName_is_required),
    lastName: string().required(Person_LastName_is_required),
    genderId: string().required(Person_Gendre_is_required),
    languageId: string().required(Person_Language_is_required),
    countryId: string().required(Person_Country_is_required),
    proPhone: string().min(10,Person_Phone_format_is_not_valid),
    mobilePhone: string().min(10, Person_Phone_format_is_not_valid),
    privatePhone: string().min(10, Person_Phone_format_is_not_valid),
    email: string().email(Person_Email_format_is_not_valid)
  })
})(Person);

PersonForm.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  person: state.person,
  thesaurus: state.thesaurus
});

export default connect(mapStateToProps, {
  ...personActions,
  ...thesaurusActions
})(withErrorHandler(withStyles(styles)(translate('translations')(PersonForm)), axios));
