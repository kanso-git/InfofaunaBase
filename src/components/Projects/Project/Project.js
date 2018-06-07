import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik } from 'formik';
import { object, string } from 'yup';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Delete from '@material-ui/icons/Delete';
import Save from '@material-ui/icons/Save';
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
import './Project.css';
import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';
import axios from '../../../axios-infofauna';
import { projectActions, thesaurusActions } from '../../../store/actions';
import * as types from '../../../store/actions/Types';
import { NavLink, Redirect, BrowserRouter } from 'react-router-dom';
import green from '@material-ui/core/colors/green';

import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import Audit from "../../Audit/Audit";
import Dialog from '../../Dialog/Dialog';
const NotificationSystem = require('react-notification-system');

const emptySuggestion={
    value: '',
    label: ''
}
let suggestionsProject = [];
let suggestionsPrincipalInstitution = [];
let suggestionsPrincipalInstitutionPerson = [];
let suggestionsMandatoryInstitution = [];
let suggestionsMandatoryInstitutionPerson = [];

class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;
    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {children}
      </MenuItem>
    );
  }
}

function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <Select
      optionComponent={Option}
      noResultsText={<Typography>{AUTOCOMPLET_No_results_found}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
      }}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps;

        const onDelete = event => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          );
        }

        return <div className="Select-value">{children}</div>;
      }}
      {...other}
    />
  );
}

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[/[1-2]/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      mask="_"
      format="##"
      placeholder="jj"
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
    />
  );
}

const ITEM_HEIGHT = 48;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none'
      }
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap'
    },
    '.Select--multi .Select-input': {
      margin: 0
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto'
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none'
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto'
    },
    '.Select-menu div': {
      boxSizing: 'content-box'
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1
    }
  },
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

  textFieldFullWidth: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
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
  checkGreen: {
    color: green[600],
    '&$checked': {
      color: green[500]
    }
  },
  checked: {},
  progress: {
    margin: theme.spacing.unit * 2
  },
  backLink: {
    color: '#3266cc',
    textDecoration: 'none'
  },
  actualSite: {
    color: '#777'
  }
});

let AUTOCOMPLET_No_results_found ;
let Project_CodeIFF_is_required ;
let Project_Name_is_required;
let Project_Url_format_is_not_valid;


class Project extends Component {
  state = {
    enableEditMode: false
  };

  componentDidMount() {
    this.notificationInput = React.createRef();
    const { id } = this.props.match.params;

      if (id && !this.props.project.ongoingRequest && this.isNotTheSame()) {
          this.props.initiateRequestProject();
          this.loadAdditionalData();
          this.props.loadAdditionalDataProject();
          this.props.fetchProject(id);
      }else if(!id){
          this.setState(()=>({
              enableEditMode: true,
              loading: true
          }))
          this.loadAdditionalData();
          this.props.loadAdditionalDataProject();
          this.setState(()=>({
              loading: false
          }))
      }
  }
    loadAdditionalData = ()=> {
        if (!this.props.thesaurus[types.REALM_PROJETTYPE]) {
            this.props.fetchThesaurus(types.REALM_PROJETTYPE);
        }
        if (!this.props.thesaurus[types.REALM_PROJETORIG]) {
            this.props.fetchThesaurus(types.REALM_PROJETORIG);
        }
        if (!this.props.thesaurus[types.REALM_PROJETLIMA]) {
            this.props.fetchThesaurus(types.REALM_PROJETLIMA);
        }
    }

    isNotTheSame =()=>{
        if(this.props.project.data ){
            const { id } = this.props.match.params;
            if(this.props.project.data.id === parseInt(id)){
                return false
            }
        }
        return true;
    }

    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps .............');
        if( nextProps.project.opreationType === types.ADD_OPREATION_TYPE ){
            const {id} = nextProps.match.params;
            if(id && id != this.props.match.params.id){
                this.props.fetchProject(id);
            }else if(!id){
                const { t } = this.props;
                this.addNofification(
                    t('Notification Body add success'),
                    t('Notification Title success'),
                    'success');
            }

        }

        if(nextProps.project.opreationType === types.MODIFY_OPREATION_TYPE){
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
        this.props.deleteProject(id);
        setTimeout(()=>this.props.history.push('/projects'), 200);
    }
  render() {
    if (this.props.project.projectsList) {
      suggestionsProject = this.props.project.projectsList.map(suggestion => ({
        value: suggestion.id,
        label: suggestion.code
      }));
        suggestionsProject =[emptySuggestion,...suggestionsProject]
    }

    if (this.props.project.personsList) {
      suggestionsPrincipalInstitutionPerson = this.props.project.personsList.map(
        suggestion => ({
          value: suggestion.id,
          label: suggestion.name
        })
      );

      suggestionsMandatoryInstitutionPerson = this.props.project.personsList.map(
        suggestion => ({
          value: suggestion.id,
          label: suggestion.name
        })
      );
    }

    if (this.props.project.institutionsList) {
      suggestionsPrincipalInstitution = this.props.project.institutionsList.map(
        suggestion => ({
          value: suggestion.id,
          label: suggestion.name
        })
      );

      suggestionsMandatoryInstitution = this.props.project.institutionsList.map(
        suggestion => ({
          value: suggestion.id,
          label: suggestion.name
        })
      );
    }
    const {t,i18n } = this.props;
    const { classes } = this.props;
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
        project
    } = this.props;

      AUTOCOMPLET_No_results_found  = t('AUTOCOMPLET No results found');
      Project_CodeIFF_is_required = t('Project Code IFF is required');
      Project_Name_is_required = t('Project Name  is required');
      Project_Url_format_is_not_valid = t('Project Url format is not valid');

      let auditData={};
      if(project.data){
          auditData={...project.data.auditDTO}
      }


      if (this.props.project.ongoingRequest) {
      return (
        <div className="ProjectContainer">
          <Paper className={classes.root} elevation={4}>
            <Typography variant="headline" component="h3">
                {t('Project Loading')}
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
      <div className="ProjectContainer">
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            <NavLink to="/projects" className={classes.backLink}>
                {t('Project Projects')}
            </NavLink>
            >
              {this.props.match.params.id ?
                  <span className={classes.actualSite}> {t('Project Project Detail')}</span>
                  :  <span className={classes.actualSite}> {t('Project Project New')}</span> }
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
                label={t('Form Enable edit mode')}
              />
            </Tooltip>
          </div>
            { this.props.match.params.id ?  <Audit {...auditData}/> :''}
          <Form>
            <br />
            <Paper className={classes.root} elevation={1}>
              <Typography component="p">{t('Project Information')}</Typography>

              <FormControl
                className={classes.formControl}
                error={touched.code && errors.code ? true : false}
              >
                <InputLabel htmlFor="code">*{t('Project Code IFF')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="code"
                  type="input"
                  name="code"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.code}
                />
                {touched.code &&
                  errors.code && (
                    <FormHelperText id="code-text">
                      {errors.code}
                    </FormHelperText>
                  )}
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="codeCh">{t('Project Code CH')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="codeCh"
                  type="input"
                  name="codeCh"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.codeCh}
                />
              </FormControl>

              <FormControl
                className={classes.formControl}
                error={touched.designation && errors.designation ? true : false}
              >
                <InputLabel htmlFor="designation">*{t('Project Name')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="designation"
                  type="input"
                  name="designation"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.designation}
                />
                {touched.designation &&
                  errors.designation && (
                    <FormHelperText id="designation-text">
                      {errors.designation}
                    </FormHelperText>
                  )}
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="projectProjectId">{t('Project Parent project')}</InputLabel>
                <Input
                  name="projectProjectId"
                  disabled={!this.state.enableEditMode}
                  inputComponent={SelectWrapped}
                  value={values.projectProjectId}
                  className={classes.textField}
                  onChange={b =>
                    this.props.setFieldValue('projectProjectId', b)
                  }
                  onBlur={handleBlur}
                  placeholder={t('Project Parent project search')}
                  id="react-select-single"
                  inputProps={{
                    classes,
                    name: 'react-select-single',
                    instanceId: 'react-select-single',
                    simpleValue: true,
                    options: suggestionsProject
                  }}
                />
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    name="voluntaryWork"
                    disabled={!this.state.enableEditMode}
                    checked={values.voluntaryWor}
                    onChange={handleChange}
                    classes={{
                      root: classes.checkGreen,
                      checked: classes.checked
                    }}
                  />
                }
                label={t('Project Principal')}
              />

              <FormControl className={classes.formControl}>
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="date"
                  label={t('Project Echance blocking')}
                  name="echeanceBlocage"
                  type="date"
                  onChange={handleChange}
                  className={classes.textField}
                  value={values.echeanceBlocage}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </FormControl>

              <FormControl
                className={classes.formControl}
                error={touched.url && errors.url ? true : false}
              >
                <InputLabel htmlFor="url">{t('Project URL')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="url"
                  type="input"
                  name="url"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.url}
                />
                {touched.url &&
                  errors.url && (
                    <FormHelperText id="url-text">{errors.url}</FormHelperText>
                  )}
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="select-projectType-native"
                  name="projectTypeId"
                  select
                  label={t('Project Type')}
                  className={classes.textField}
                  value={values.projectTypeId}
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
                  {thesaurus[types.REALM_PROJETTYPE] ? (
                    thesaurus[types.REALM_PROJETTYPE].map(option => (
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
                  name="projectOriginId"
                  select
                  label={t('Project Origin funding')}
                  className={classes.textField}
                  value={values.projectOriginId}
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
                  {thesaurus[types.REALM_PROJETORIG] ? (
                    thesaurus[types.REALM_PROJETORIG].map(option => (
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
                  id="select-projectLima-native"
                  name="projectLimaId"
                  select
                  label={t('Project Access limits')}
                  className={classes.textField}
                  value={values.projectLimaId}
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
                  {thesaurus[types.REALM_PROJETLIMA] ? (
                    thesaurus[types.REALM_PROJETLIMA].map(option => (
                      <option key={option.id} value={option.codeValue}>
                        {option.designation}
                      </option>
                    ))
                  ) : (
                    <option value="-1" />
                  )}
                </TextField>
              </FormControl>

              <br />
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="debutJour">{t('Project Date strat')} {t('Project Date day')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="debutJour"
                  type="number"
                  name="debutJour"
                  className={classes.textField}
                  style={{ width: 100 }}
                  onChange={e => {
                    const val = e.target.value;
                    if (!val || (val > 0 && val < 32)) {
                      return this.props.setFieldValue('debutJour', val);
                    }
                  }}
                  onBlur={handleBlur}
                  value={values.debutJour}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="debutMois">{t('Project Date strat')} {t('Project Date month')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="debutMois"
                  type="number"
                  name="debutMois"
                  style={{ width: 100 }}
                  className={classes.textField}
                  onChange={e => {
                    const val = e.target.value;
                    if (!val || (val > 0 && val < 13)) {
                      return this.props.setFieldValue('debutMois', val);
                    }
                  }}
                  onBlur={handleBlur}
                  value={values.debutMois}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="debutMois">{t('Project Date strat')} {t('Project Date year')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="debutAnnee"
                  name="debutAnnee"
                  className={classes.textField}
                  style={{ width: 100 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.debutAnnee}
                  inputComponent={TextMaskCustom}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="finJour">{t('Project Date end')} {t('Project Date day')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="finJour"
                  type="number"
                  name="finJour"
                  className={classes.textField}
                  style={{ width: 100 }}
                  onChange={e => {
                    const val = e.target.value;
                    if (!val || (val > 0 && val < 32)) {
                      return this.props.setFieldValue('finJour', val);
                    }
                  }}
                  onBlur={handleBlur}
                  value={values.finJour}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="finMois">{t('Project Date end')} {t('Project Date month')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="finMois"
                  type="number"
                  name="finMois"
                  style={{ width: 100 }}
                  className={classes.textField}
                  onChange={e => {
                    const val = e.target.value;
                    if (!val || (val > 0 && val < 13)) {
                      return this.props.setFieldValue('finMois', val);
                    }
                  }}
                  onBlur={handleBlur}
                  value={values.finMois}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="finAnnee">{t('Project Date end')} {t('Project Date year')}</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="finAnnee"
                  name="finAnnee"
                  className={classes.textField}
                  style={{ width: 100 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.finAnnee}
                  inputComponent={TextMaskCustom}
                />
              </FormControl>

              <br />

              <TextField
                disabled={!this.state.enableEditMode}
                id="description"
                label={t('Project Description')}
                InputLabelProps={{
                  shrink: true
                }}
                rows="2"
                rowsMax="4"
                type="input"
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                style={{ marginLeft: 10 }}
                fullWidth
                margin="normal"
              />
            </Paper>

            <Paper className={classes.root} elevation={1}>
              <Typography component="h4">{t('Project Mandating institution')}</Typography>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="principalInstitutionId">
                    {t('Project Mandating institution name')}
                </InputLabel>
                <Input
                  name="principalInstitutionId"
                  disabled={!this.state.enableEditMode}
                  inputComponent={SelectWrapped}
                  value={values.principalInstitutionId}
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={b =>
                    this.props.setFieldValue('principalInstitutionId', b)
                  }
                  onBlur={handleBlur}
                  placeholder={t('Project Mandating institution name search')}
                  id="react-select-single-principalInstitution"
                  inputProps={{
                    classes,
                    name: 'react-select-single',
                    instanceId: 'react-select-single',
                    simpleValue: true,
                    options: suggestionsPrincipalInstitution
                  }}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="principalInstitutionPersonId">
                    {t('Project Mandating institution person')}
                </InputLabel>
                <Input
                  name="principalInstitutionPersonId"
                  disabled={!this.state.enableEditMode}
                  inputComponent={SelectWrapped}
                  value={values.principalInstitutionPersonId}
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={b =>
                    this.props.setFieldValue('principalInstitutionPersonId', b)
                  }
                  onBlur={handleBlur}
                  placeholder= {t('Project Mandating institution person search')}
                  id="react-select-single-principalInstitutionPerson"
                  inputProps={{
                    classes,
                    name: 'react-select-single',
                    instanceId: 'react-select-single',
                    simpleValue: true,
                    options: suggestionsPrincipalInstitutionPerson
                  }}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="principalInstitutionName">
                    {t('Project Mandating institution name manuel')}
                </InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="principalInstitutionName"
                  name="principalInstitutionName"
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.principalInstitutionName}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="principalInstitutionRespLastName">
                    {t('Project Mandating institution firstName manuel')}
                </InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="principalInstitutionRespLastName"
                  name="principalInstitutionRespLastName"
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.principalInstitutionRespLastName}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="principalInstitutionRespFirstName">
                    {t('Project Mandating institution lastName manuel')}
                </InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="principalInstitutionRespFirstName"
                  name="principalInstitutionRespFirstName"
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.principalInstitutionRespFirstName}
                />
              </FormControl>
            </Paper>

            <Paper className={classes.root} elevation={1}>
              <Typography component="h4">{t('Project Mandatory institution')} </Typography>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="mandatorylInstitutionId">
                    {t('Project Mandatory institution name')}
                </InputLabel>

                <Input
                  name="mandatorylInstitutionId"
                  disabled={!this.state.enableEditMode}
                  inputComponent={SelectWrapped}
                  value={values.mandataryInstitutionId}
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={b =>
                    this.props.setFieldValue('mandataryInstitutionId', b)
                  }
                  onBlur={handleBlur}
                  placeholder= {t('Project Mandatory institution name search')}
                  id="mandatorylInstitutionId"
                  inputProps={{
                    classes,
                    name: 'react-select-single',
                    instanceId: 'react-select-single',
                    simpleValue: true,
                    options: suggestionsMandatoryInstitution
                  }}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="mandataryInstitutionPersonId">
                    {t('Project Mandatory institution person')}
                </InputLabel>
                <Input
                  name="mandataryInstitutionPersonId"
                  disabled={!this.state.enableEditMode}
                  inputComponent={SelectWrapped}
                  value={values.mandataryInstitutionPersonId}
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={b =>
                    this.props.setFieldValue('mandataryInstitutionPersonId', b)
                  }
                  onBlur={handleBlur}
                  placeholder= {t('Project Mandatory institution person search')}
                  id="mandataryInstitutionPersonId"
                  inputProps={{
                    classes,
                    name: 'react-select-single',
                    instanceId: 'react-select-single',
                    simpleValue: true,
                    options: suggestionsMandatoryInstitutionPerson
                  }}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="mandataryInstitutionName">
                    {t('Project Mandatory institution name manuel')}
                </InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="mandataryInstitutionName"
                  name="mandataryInstitutionName"
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mandataryInstitutionName}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="mandataryInstitutionRespLastName">
                    {t('Project Mandatory institution firstName manuel')}
                </InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="mandataryInstitutionRespLastName"
                  name="mandataryInstitutionRespLastName"
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mandataryInstitutionRespLastName}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="mandataryInstitutionRespFirstName">
                    {t('Project Mandatory institution lastName manuel')}
                </InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="mandataryInstitutionRespFirstName"
                  name="mandataryInstitutionRespFirstName"
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mandataryInstitutionRespFirstName}
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
                          &nbsp; &nbsp;{t('Project Save')}
                      </Button>
                      { this.props.match.params.id
                          ?
                          <Button
                              className={classes.button}
                              variant="raised"
                              color="secondary"
                              onClick={() => this.setState(()=>({dialog: true})) }
                          >
                              {t('Project Delete')}
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

const ProjectForm = withFormik({
  // we can passe the default values props from the parent component - useful for edit
  enableReinitialize: true,
  mapPropsToValues({ firstName, lastName, username, password, project }) {
    return {
      code: project.data && project.data.code ? project.data.code : '',
      codeCh: project.data && project.data.codeCh ? project.data.codeCh : '',
      designation:
        project.data && project.data.designation
          ? project.data.designation
          : '',
      projectProjectId:
        project.data && project.data.projectProjectId
          ? project.data.projectProjectId
          : '',
      voluntaryWork:
        project.data && project.data.voluntaryWork
          ? project.data.voluntaryWork
          : '',
      echeanceBlocage:
        project.data && project.data.echeanceBlocage
          ? moment(project.data.echeanceBlocage).format('YYYY-MM-DD')
          : '',
      url: project.data && project.data.url ? project.data.url : '',
      projectTypeId:
        project.data && project.data.projectTypeId
          ? project.data.projectTypeId
          : '',
      projectOriginId:
        project.data && project.data.projectOriginId
          ? project.data.projectOriginId
          : '',
      projectLimaId:
        project.data && project.data.projectLimaId
          ? project.data.projectLimaId
          : '',
      debutJour:
        project.data && project.data.debutJour ? project.data.debutJour : '',
      debutMois:
        project.data && project.data.debutMois ? project.data.debutMois : '',
      debutAnnee:
        project.data && project.data.debutAnnee ? project.data.debutAnnee : '',
      finJour: project.data && project.data.finJour ? project.data.finJour : '',
      finMois: project.data && project.data.finMois ? project.data.finMois : '',
      finAnnee:
        project.data && project.data.finAnnee ? project.data.finAnnee : '',
      description:
        project.data && project.data.description
          ? project.data.description
          : '',

      principalInstitutionId:
        project.data && project.data.principalInstitutionId
          ? project.data.principalInstitutionId
          : '',

      principalInstitutionPersonId:
        project.data && project.data.principalInstitutionPersonId
          ? project.data.principalInstitutionPersonId
          : '',

      mandataryInstitutionId:
        project.data && project.data.mandataryInstitutionId
          ? project.data.mandataryInstitutionId
          : '',

      mandataryInstitutionPersonId:
        project.data && project.data.mandataryInstitutionPersonId
          ? project.data.mandataryInstitutionPersonId
          : '',

      principalInstitutionName:
        project.data && project.data.principalInstitutionName
          ? project.data.principalInstitutionName
          : '',
      principalInstitutionRespFirstName:
        project.data && project.data.principalInstitutionRespFirstName
          ? project.data.principalInstitutionRespFirstName
          : '',
      principalInstitutionRespLastName:
        project.data && project.data.principalInstitutionRespLastName
          ? project.data.principalInstitutionRespLastName
          : '',

      mandataryInstitutionName:
        project.data && project.data.mandataryInstitutionName
          ? project.data.mandataryInstitutionName
          : '',
      mandataryInstitutionRespFirstName:
        project.data && project.data.mandataryInstitutionRespFirstName
          ? project.data.mandataryInstitutionRespFirstName
          : '',
      mandataryInstitutionRespLastName:
        project.data && project.data.mandataryInstitutionRespLastName
          ? project.data.mandataryInstitutionRespLastName
          : ''
    };
  },

    async handleSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
        console.log(JSON.stringify(values, null,3));
        if(props.match.params.id){
            const { id } = props.match.params;
            await props.updateProject(id, values);
            await props.fetchProject(id);
            setSubmitting(false);
        }else{
            const response= await props.addNewProject(values);
            setTimeout(()=>props.history.push(response.headers.location), 200);
        }

    },

    isInitialValid: (props)=> props.match.params.id ? true:false,
  validationSchema:()=> object().shape({
    code: string().required(Project_CodeIFF_is_required),
    designation: string().required(Project_Name_is_required),
    url: string().url(Project_Url_format_is_not_valid)
  })
})(Project);

ProjectForm.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  project: state.project,
  thesaurus: state.thesaurus
});

export default connect(mapStateToProps, {
  ...projectActions,
  ...thesaurusActions
})(withErrorHandler(withStyles(styles)(translate('translations')(ProjectForm)), axios));
