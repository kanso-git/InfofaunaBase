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
import  './Project.css';
import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';
import Spinner from'../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-infofauna';
import { projectActions, thesaurusActions } from '../../../store/actions';
import * as types from '../../../store/actions/Types';
import {NavLink, Redirect} from 'react-router-dom';
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

let suggestionsProject = [];


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
                    fontWeight: isSelected ? 500 : 400,
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
        height: 250,
    },
    chip: {
        margin: theme.spacing.unit / 4,
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
                boxShadow: 'none',
            },
        },
        '.Select-multi-value-wrapper': {
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
        },
        '.Select--multi .Select-input': {
            margin: 0,
        },
        '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
            padding: 0,
        },
        '.Select-noresults': {
            padding: theme.spacing.unit * 2,
        },
        '.Select-input': {
            display: 'inline-flex !important',
            padding: 0,
            height: 'auto',
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
            outline: 0,
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
            padding: 0,
        },
        '.Select-placeholder': {
            opacity: 0.42,
            color: theme.palette.common.black,
        },
        '.Select-menu-outer': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            position: 'absolute',
            left: 0,
            top: `calc(100% + ${theme.spacing.unit}px)`,
            width: '100%',
            zIndex: 2,
            maxHeight: ITEM_HEIGHT * 4.5,
        },
        '.Select.is-focused:not(.is-open) > .Select-control': {
            boxShadow: 'none',
        },
        '.Select-menu': {
            maxHeight: ITEM_HEIGHT * 4.5,
            overflowY: 'auto',
        },
        '.Select-menu div': {
            boxSizing: 'content-box',
        },
        '.Select-arrow-zone, .Select-clear-zone': {
            color: theme.palette.action.active,
            cursor: 'pointer',
            height: 21,
            width: 21,
            zIndex: 1,
        },
        // Only for screen readers. We can't use display none.
        '.Select-aria-only': {
            position: 'absolute',
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            height: 1,
            width: 1,
            margin: -1,
        },
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
    checkGreen:{

            color: green[600],
            '&$checked': {
                color: green[500],
            },

    },
    checked: {},
});



class Project extends Component {
    state = {
        showPassword: false,
        enableEditMode:true,
    };


    componentDidMount() {
        const {id} = this.props.match.params;
        console.log(this.props);
        if((!this.props.project.data)||(this.props.project.data !=null && this.props.project.data.id != id )){

            if(!this.props.thesaurus[types.REALM_PROJETTYPE]){
                this.props.fetchThesaurus(types.REALM_PROJETTYPE);
            }
            if(!this.props.thesaurus[types.REALM_PROJETORIG]){
                this.props.fetchThesaurus(types.REALM_PROJETORIG);
            }
            if(!this.props.thesaurus[types.REALM_PROJETLIMA]){
                this.props.fetchThesaurus(types.REALM_PROJETLIMA);
            }


            this.props.fetchProjectsList();
            this.props.fetchProject(id);

            if(this.props.project.projectsList ){

                suggestionsProject = this.props.project.projectsList.map(suggestion => ({
                    value: suggestion.id ,
                    label: suggestion.code
                }));
            }
        }
    }

    handleEnableEditMode = ()=>{
        this.setState((prevState) =>({enableEditMode: !prevState.enableEditMode}));
    }
    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    render() {
        if (this.props.ongoingFetch) {
            return <Spinner />;
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

        console.log("isSubmitting:"+isSubmitting);
        console.log("isValid:"+isValid)

        return (
            <div className="ProjectContainer">

                <Paper className={classes.root} elevation={4}>
                    <Typography variant="headline" component="h3">
                        Détail du projet
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

                    <Form  >
                        <br/>
                        <Paper className={classes.root} elevation={1}>
                            <Typography  component="p">
                                Information projectnelle
                            </Typography>


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



                            <FormControl
                                className={classes.formControl}

                            >

                                <Input
                                    name="projectProjectId"
                                    inputComponent={SelectWrapped}
                                    value={values.projectProjectId}
                                    className={classes.textField}
                                    onChange={(b)=>this.props.setFieldValue('projectProjectId', b)}
                                    onBlur={handleBlur}
                                    placeholder="Search parent project"
                                    id="react-select-single"
                                    inputProps={{
                                        classes,
                                        name: 'react-select-single',
                                        instanceId: 'react-select-single',
                                        simpleValue: true,
                                        options: suggestionsProject,
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
                                            checked: classes.checked,
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
                                        shrink: true,
                                    }}
                                />

                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="codeCh">URL du projet</InputLabel>
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

                            <FormControl className={classes.formControl}>
                                <TextField
                                    disabled={!this.state.enableEditMode}
                                    id="select-gender-native"
                                    name="genderId"
                                    select
                                    label="Type du projet"
                                    className={classes.textField}
                                    value={values.genderId}
                                    onChange={handleChange}
                                    SelectProps={{
                                        native: true,
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}

                                    margin="normal"
                                >

                                    {thesaurus[types.REALM_PROJETTYPE] ? thesaurus[types.REALM_PROJETTYPE].map(option => (
                                        <option key={option.id} value={option.code}>
                                            {option.designation}
                                        </option>
                                    )): <option value="-1"></option>}
                                </TextField>
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <TextField
                                    disabled={!this.state.enableEditMode}
                                    id="select-language-native"
                                    name="languageId"
                                    select
                                    label="*Langue"
                                    className={classes.textField}
                                    value={values.languageId}
                                    onChange={handleChange}
                                    SelectProps={{
                                        native: true,
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}

                                    margin="normal"
                                >

                                    {thesaurus[types.REALM_PROJETORIG] ? thesaurus[types.REALM_PROJETORIG].map(option => (
                                        <option key={option.id} value={option.code}>
                                            {option.designation}
                                        </option>
                                    )): <option value="-1"></option>}
                                </TextField>
                            </FormControl>


                            <FormControl className={classes.formControl}>
                                <TextField
                                    disabled={!this.state.enableEditMode}
                                    id="select-language-native"
                                    name="languageId"
                                    select
                                    label="Limites d’accès aux données"
                                    className={classes.textField}
                                    value={values.languageId}
                                    onChange={handleChange}
                                    SelectProps={{
                                        native: true,
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}

                                    margin="normal"
                                >

                                    {thesaurus[types.REALM_PROJETLIMA] ? thesaurus[types.REALM_PROJETLIMA].map(option => (
                                        <option key={option.id} value={option.code}>
                                            {option.designation}
                                        </option>
                                    )): <option value="-1"></option>}
                                </TextField>
                            </FormControl>




                        </Paper>

                        <Paper className={classes.root} elevation={1}>
                            <Typography  component="h4">
                                Adresse
                            </Typography>

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
                                    style={{width:150}}
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
                                    style={{width:150}}
                                    value={values.countryId}
                                    onChange={handleChange}
                                    SelectProps={{
                                        native: true,
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}

                                    margin="normal"
                                >

                                    {thesaurus[types.REALM_COUNTRY] ? thesaurus[types.REALM_COUNTRY].map(option => (
                                        <option key={option.id} value={option.code}>
                                            {option.designation}
                                        </option>
                                    )): <option value="-1"></option>}
                                </TextField>
                            </FormControl>
                        </Paper>


                        <Paper className={classes.root} elevation={1}>
                            <Typography component="p">
                                Information de contact
                            </Typography>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="proPhone">Téléphone professionnel</InputLabel>
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
                                <InputLabel htmlFor="mobilePhone">Téléphone mobile</InputLabel>
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
                                <InputLabel htmlFor="privatePhone">Téléphone privé</InputLabel>
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
                                <InputLabel htmlFor="email">E-mail</InputLabel>
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




                        <br/>

                        {this.state.enableEditMode &&

                        (
                            <div>
                                <Button className={classes.button} variant="raised" type="submit"  disabled={isSubmitting || !isValid} size="small">
                                    <Save className={classNames(classes.rightIcon)}   />
                                    Save
                                </Button>

                                <Button className={classes.button} variant="raised" color="secondary">
                                    Delete
                                    <Delete className={classes.rightIcon} />
                                </Button>
                            </div>

                        )
                        }

                    </Form>

                </Paper>


            </div>
        );
    }
}

const ProjectForm = withFormik({
    // we can passe the default values props from the parent component - useful for edit
    mapPropsToValues({firstName, lastName, username, password , project}) {
        return {
            title:        project.data && project.data.titleId ? project.data.titleId: '',
            countryId:    project.data && project.data.countryId? project.data.countryId: '',
            genderId:     project.data && project.data.genderId? project.data.genderId: '',
            languageId:   project.data && project.data.languageId? project.data.languageId: '',
            dateOfBirth:  project.data && project.data.dateOfBirth ? moment(project.data.dateOfBirth).format('YYYY-MM-DD'): '',
            firstName:    project.data && project.data.firstName? project.data.firstName: '',
            lastName:     project.data && project.data.lastName? project.data.lastName: '',
            proPhone:     project.data && project.data.proPhone? project.data.proPhone: '',
            mobilePhone:  project.data && project.data.mobilePhone? project.data.mobilePhone: '',
            privatePhone: project.data && project.data.privatePhone? project.data.privatePhone: '',
            email:        project.data && project.data.email? project.data.email: '',
            projectProjectId:'',
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
        firstName: string().required('firstName is required ..'),
        lastName:  string().required('lastName is required ..'),
        genderId: string().required('gender is required ..'),
        languageId: string().required('language is required ..'),
        countryId:string().required('country is required ..'),
        proPhone:string().min(10, 'Phone must be 10 or longer'),
        mobilePhone:string().min(10, 'Phone must be 10 or longer'),
        privatePhone:string().min(10, 'Phone must be 10 or longer'),
        email:  string().email('Email is not valid !')


    })
})(Project);

ProjectForm.propTypes = {
    classes: PropTypes.object.isRequired
};
const mapStateToProps = state =>({
    project: state.project,
    thesaurus: state.thesaurus
} );

export default connect(mapStateToProps, { ...projectActions, ...thesaurusActions })(
    withErrorHandler(withStyles(styles)(ProjectForm), axios)
);
