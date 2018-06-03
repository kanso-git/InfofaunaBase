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
import './Institution.css';
import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-infofauna';
import { institutionActions, thesaurusActions } from '../../../store/actions';
import * as types from '../../../store/actions/Types';
import { NavLink, Redirect } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

let suggestionsPerson = [];

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

class Institution extends Component {
  state = {
    loadingProgress: false,
    enableEditMode: false
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    console.log(
      '>>>>>>>>>>>>>>>>loadingProgress :' + this.state.loadingProgress
    );

    if (
      !this.props.institution.ongoingFetch &&
      (!this.props.institution.data ||
        (this.props.institution.data != null &&
          this.props.institution.data.id != id))
    ) {
      this.props.initiateFetchInstitution();

      if (!this.props.thesaurus[types.REALM_COUNTRY]) {
        this.props.fetchThesaurus(types.REALM_COUNTRY);
      }
      if (!this.props.thesaurus[types.REALM_FUNCTION]) {
        this.props.fetchThesaurus(types.REALM_FUNCTION);
      }

      this.props.fetchInstitution(id);
    }
  }

  handleEnableEditMode = () => {
    this.setState(prevState => ({ enableEditMode: !prevState.enableEditMode }));
  };
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    if (this.props.institution.personsList) {
      suggestionsPerson = this.props.institution.personsList.map(
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

    if (this.props.institution.ongoingFetch) {
      return (
        <div className="InstitutionContainer">
          <Paper className={classes.root} elevation={4}>
            <Typography variant="headline" component="h3">
              Chrargement institution ...
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
      <div className="InstitutionContainer">
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            <NavLink to="/persons" className={classes.backLink}>
              Institutions
            </NavLink>{' '}
            >
            <span className={classes.actualSite}> Détail de l'instutition</span>
          </Typography>

          <div style={{ float: 'right' }}>
            <Tooltip id="tooltip-fab" title="enable edit">
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
              <Typography component="p">Nom et abbréviation</Typography>

              <FormControl
                className={classes.formControl}
                error={touched.acronym && errors.acronym ? true : false}
              >
                <InputLabel htmlFor="acronym">*Abbréviation</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="acronym"
                  type="input"
                  name="acronym"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.acronym}
                />
                {touched.acronym &&
                  errors.acronym && (
                    <FormHelperText id="acronym-text">
                      {errors.acronym}
                    </FormHelperText>
                  )}
              </FormControl>

              <FormControl
                className={classes.formControl}
                error={touched.name && errors.name ? true : false}
              >
                <InputLabel htmlFor="name">*Nom</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="name"
                  type="input"
                  name="name"
                  className={classes.textField}
                  style={{ width: 400 }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                {touched.name &&
                  errors.name && (
                    <FormHelperText id="name-text">
                      {errors.name}
                    </FormHelperText>
                  )}
              </FormControl>
            </Paper>

            <Paper className={classes.root} elevation={1}>
              <Typography component="h4">Adresse et contact</Typography>

              <FormControl
                className={classes.formControl}
                error={touched.address1 && errors.address1 ? true : false}
              >
                <InputLabel htmlFor="address1">Rue et numéro</InputLabel>
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
                <InputLabel htmlFor="address2">Complément</InputLabel>
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
                <InputLabel htmlFor="zipCode">Code postal</InputLabel>
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
                <InputLabel htmlFor="locality">Localité</InputLabel>
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
                  label="*Pays"
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
                  {thesaurus[types.REALM_COUNTRY] ? (
                    thesaurus[types.REALM_COUNTRY].map(option => (
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
                <InputLabel htmlFor="phone">Téléphone</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="phone"
                  type="input"
                  name="phone"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="mobilePhone">Fax</InputLabel>
                <Input
                  disabled={!this.state.enableEditMode}
                  id="fax"
                  type="input"
                  name="fax"
                  className={classes.textField}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fax}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="url">Url</InputLabel>
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
              </FormControl>
            </Paper>

            <Paper className={classes.root} elevation={1}>
              <Typography component="p">Personne responsable</Typography>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="personInChargeId">*Personne</InputLabel>
                <Input
                  name="personInChargeId"
                  inputComponent={SelectWrapped}
                  value={values.personInChargeId}
                  className={classes.textField}
                  onChange={b =>
                    this.props.setFieldValue('personInChargeId', b)
                  }
                  onBlur={handleBlur}
                  placeholder="Search person In ChargeId"
                  id="react-select-single"
                  inputProps={{
                    classes,
                    name: 'react-select-single',
                    instanceId: 'react-select-single',
                    simpleValue: true,
                    options: suggestionsPerson
                  }}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  disabled={!this.state.enableEditMode}
                  id="select-personInChargeFunction-native"
                  name="personInChargeFunctionId"
                  select
                  label="*Fonction dans l'institution"
                  className={classes.textField}
                  value={values.personInChargeFunctionId}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                  {thesaurus[types.REALM_FUNCTION] ? (
                    thesaurus[types.REALM_FUNCTION].map(option => (
                      <option key={option.id} value={option.code}>
                        {option.designation}
                      </option>
                    ))
                  ) : (
                    <option value="-1" />
                  )}
                </TextField>
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

const InstitutionForm = withFormik({
  // we can passe the default values props from the parent component - useful for edit
  enableReinitialize: true,
  mapPropsToValues({ firstName, lastName, username, password, institution }) {
    return {
      acronym:
        institution.data && institution.data.acronym
          ? institution.data.acronym
          : '',
      name:
        institution.data && institution.data.name ? institution.data.name : '',
      address1:
        institution.data && institution.data.address1
          ? institution.data.address1
          : '',
      address2:
        institution.data && institution.data.address2
          ? institution.data.address2
          : '',

      zipCode:
        institution.data && institution.data.zipCode
          ? institution.data.zipCode
          : '',
      locality:
        institution.data && institution.data.locality
          ? institution.data.locality
          : '',

      countryId:
        institution.data && institution.data.countryId
          ? institution.data.countryId
          : -1,
      personInChargeId:
        institution.data && institution.data.personInChargeId
          ? institution.data.personInChargeId
          : -1,
      personInChargeFunctionId:
        institution.data && institution.data.personInChargeFunctionId
          ? institution.data.personInChargeFunctionId
          : -1,

      phone:
        institution.data && institution.data.phone
          ? institution.data.phone
          : '',
      fax: institution.data && institution.data.fax ? institution.data.fax : '',
      url: institution.data && institution.data.url ? institution.data.url : ''
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
    acronym: string().required('Abbréviation is required ..'),
    name: string().required('Nom is required ..'),
    genderId: string().required('gender is required ..'),
    languageId: string().required('language is required ..'),
    countryId: string().required('country is required ..'),
    proPhone: string().min(10, 'Phone must be 10 or longer'),
    mobilePhone: string().min(10, 'Phone must be 10 or longer'),
    privatePhone: string().min(10, 'Phone must be 10 or longer'),
    email: string().email('Email is not valid !')
  })
})(Institution);

InstitutionForm.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  institution: state.institution,
  thesaurus: state.thesaurus
});

export default connect(mapStateToProps, {
  ...institutionActions,
  ...thesaurusActions
})(withErrorHandler(withStyles(styles)(InstitutionForm), axios));
