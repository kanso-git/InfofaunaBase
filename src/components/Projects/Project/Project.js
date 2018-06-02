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
      noResultsText={<Typography>{'No results found'}</Typography>}
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

class Project extends Component {
  state = {
    enableEditMode: false
  };

  componentDidMount() {
    const { id } = this.props.match.params;

    if (
      !this.props.project.ongoingFetch &&
      (!this.props.project.data ||
        (this.props.project.data != null && this.props.project.data.id != id))
    ) {
      this.props.initiateFetchProject();
      if (!this.props.thesaurus[types.REALM_PROJETTYPE]) {
        this.props.fetchThesaurus(types.REALM_PROJETTYPE);
      }
      if (!this.props.thesaurus[types.REALM_PROJETORIG]) {
        this.props.fetchThesaurus(types.REALM_PROJETORIG);
      }
      if (!this.props.thesaurus[types.REALM_PROJETLIMA]) {
        this.props.fetchThesaurus(types.REALM_PROJETLIMA);
      }

      console.log('calling  fetchProject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      this.props.fetchProject(id);
    }
  }

  handleEnableEditMode = () => {
    this.setState(prevState => ({ enableEditMode: !prevState.enableEditMode }));
  };
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    if (this.props.project.projectsList) {
      suggestionsProject = this.props.project.projectsList.map(suggestion => ({
        value: suggestion.id,
        label: suggestion.code
      }));
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
      thesaurus
    } = this.props;

    if (this.props.project.ongoingFetch) {
      return (
        <div className="ProjectContainer">
          <Paper className={classes.root} elevation={4}>
            <Typography variant="headline" component="h3">
              Chrargement du projet
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
              Projects
            </NavLink>{' '}
            >
            <span className={classes.actualSite}> Détail du projet</span>
          </Typography>

          <div style={{ float: 'right' }}>
            <Tooltip id="tooltip-fab" title="Ajouter une nouvelle projectne">
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.enableEditMode}
                    onChange={this.handleEnableEditMode}
                    value="enableEditMode"
                    color="primary"
                  />
                }
                label="Enable edit mode"
              />
            </Tooltip>
          </div>

          <Form>
            <br />
            <Paper className={classes.root} elevation={1}>
              <Typography component="p">Information du projet</Typography>

              <FormControl
                className={classes.formControl}
                error={touched.code && errors.code ? true : false}
              >
                <InputLabel htmlFor="code">*Code infofauna</InputLabel>
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
                <InputLabel htmlFor="codeCh">Code info species</InputLabel>
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
                <InputLabel htmlFor="designation">*Nom du projet</InputLabel>
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
                <InputLabel htmlFor="codeCh">Projet principale</InputLabel>
                <Input
                  name="projectProjectId"
                  inputComponent={SelectWrapped}
                  value={values.projectProjectId}
                  className={classes.textField}
                  onChange={b =>
                    this.props.setFieldValue('projectProjectId', b)
                  }
                  onBlur={handleBlur}
                  placeholder="Search parent project"
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
                    checked={values.voluntaryWor}
                    onChange={handleChange}
                    classes={{
                      root: classes.checkGreen,
                      checked: classes.checked
                    }}
                  />
                }
                label="Projet principale"
              />

              <FormControl className={classes.formControl}>
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="date"
                  label="Echéance blocage"
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
                <InputLabel htmlFor="url">URL du projet</InputLabel>
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
                  label="Type du projet"
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
                      <option key={option.id} value={option.code}>
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
                  label="Origin de financement"
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
                      <option key={option.id} value={option.code}>
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
                  label="Limites d’accès aux données"
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
                      <option key={option.id} value={option.code}>
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
                <InputLabel htmlFor="debutJour">Début jour</InputLabel>
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
                <InputLabel htmlFor="debutMois">Début mois</InputLabel>
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
                <InputLabel htmlFor="debutMois">Début année</InputLabel>
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
                <InputLabel htmlFor="finJour">Fin jour</InputLabel>
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
                <InputLabel htmlFor="finMois">Fin mois</InputLabel>
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
                <InputLabel htmlFor="finAnnee">Fin année</InputLabel>
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
                label="Description du projet"
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
              <Typography component="h4">Organisation mandante</Typography>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="principalInstitutionId">
                  Nom de l'organisation mandante
                </InputLabel>
                <Input
                  name="principalInstitutionId"
                  inputComponent={SelectWrapped}
                  value={values.principalInstitutionId}
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={b =>
                    this.props.setFieldValue('principalInstitutionId', b)
                  }
                  onBlur={handleBlur}
                  placeholder="Rechercher organisation mandante"
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
                  Personne (administrateur / initiateur)
                </InputLabel>
                <Input
                  name="principalInstitutionPersonId"
                  inputComponent={SelectWrapped}
                  value={values.principalInstitutionPersonId}
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={b =>
                    this.props.setFieldValue('principalInstitutionPersonId', b)
                  }
                  onBlur={handleBlur}
                  placeholder="Rechercher administrateur / initiateur"
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
                  Nom au début du projet (si différente)
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
                  Nom administrateur au début du projet (si différente)
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
                  Prénom administrateur au début du projet (si différente)
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
              <Typography component="h4">Organisation mandataire </Typography>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="mandatorylInstitutionId">
                  Nom de l'organisation mandataire
                </InputLabel>

                <Input
                  name="mandatorylInstitutionId"
                  inputComponent={SelectWrapped}
                  value={values.mandataryInstitutionId}
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={b =>
                    this.props.setFieldValue('mandataryInstitutionId', b)
                  }
                  onBlur={handleBlur}
                  placeholder="Rechercher organisation mandataire"
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
                  Personne (administrateur / initiateur)
                </InputLabel>
                <Input
                  name="mandataryInstitutionPersonId"
                  inputComponent={SelectWrapped}
                  value={values.mandataryInstitutionPersonId}
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={b =>
                    this.props.setFieldValue('mandataryInstitutionPersonId', b)
                  }
                  onBlur={handleBlur}
                  placeholder="Rechercher administrateur / initiateur"
                  id=""
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
                  Nom au début du projet (si différente)
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
                  Nom administrateur au début du projet (si différente)
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
                  Prénom administrateur au début du projet (si différente)
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
              <div>
                <Button
                  className={classes.button}
                  variant="raised"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  size="small"
                >
                  <Save className={classNames(classes.rightIcon)} />
                  Save
                </Button>

                <Button
                  className={classes.button}
                  variant="raised"
                  color="secondary"
                >
                  Delete
                  <Delete className={classes.rightIcon} />
                </Button>
              </div>
            )}
          </Form>
        </Paper>
      </div>
    );
  }
}

const ProjectForm = withFormik({
  // we can passe the default values props from the parent component - useful for edit
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
          : -1,
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
          : -1,
      projectOriginId:
        project.data && project.data.projectOriginId
          ? project.data.projectOriginId
          : -1,
      projectLimaId:
        project.data && project.data.projectLimaId
          ? project.data.projectLimaId
          : -1,
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
          : -1,

      principalInstitutionPersonId:
        project.data && project.data.principalInstitutionPersonId
          ? project.data.principalInstitutionPersonId
          : -1,

      mandataryInstitutionId:
        project.data && project.data.mandataryInstitutionId
          ? project.data.mandataryInstitutionId
          : -1,

      mandataryInstitutionPersonId:
        project.data && project.data.mandataryInstitutionPersonId
          ? project.data.mandataryInstitutionPersonId
          : -1,

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
  handleSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
    // let's suppose that we do a server validtion call
    //props.initiateLogin();
    //props.login(values);
    //setSubmitting(false);
  },
  isInitialValid: true,
  validationSchema: object().shape({
    code: string().required('Code info fauna is required ..'),
    designation: string().required('Projet name  is required ..'),
    url: string().url('url is not valide')
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
})(withErrorHandler(withStyles(styles)(ProjectForm), axios));
