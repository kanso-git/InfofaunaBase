import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik } from 'formik';
import { object, string } from 'yup';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import ExplorIcon from '@material-ui/icons/Explore';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

import personCss from './Person.css';

import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';

import Spinner from'../../../components/UI/Spinner/Spinner';

import axios from '../../../axios-infofauna';
import { personActions, thesaurusActions } from '../../../store/actions';
import * as types from '../../../store/actions/Types';
import {NavLink, Redirect} from 'react-router-dom';
import {Field} from "formik/dist/formik.umd";

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
    }
});

class Person extends Component {
    state = {
        showPassword: false,
        enableEditMode:true,
    };


    componentDidMount() {
        const {id} = this.props.match.params;
        console.log(this.props);
        if((!this.props.person.data)||(this.props.person.data !=null && this.props.person.data.id != id )){

                if(!this.props.thesaurus[types.REALM_COUNTRY]){
                    this.props.fetchThesaurus(types.REALM_COUNTRY);
                }
                if(!this.props.thesaurus[types.REALM_GENDER]){
                    this.props.fetchThesaurus(types.REALM_GENDER);
                }
                if(!this.props.thesaurus[types.REALM_TITLE]){
                    this.props.fetchThesaurus(types.REALM_TITLE);
                }
                if(!this.props.thesaurus[types.REALM_LANGUAGE]){
                    this.props.fetchThesaurus(types.REALM_LANGUAGE);
                }

            this.props.fetchPerson(id);
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

        console.log(values);

        return (
            <div className={personCss.PersonContainer}>

                    <Paper className={classes.root} elevation={4}>
                        <Typography variant="headline" component="h3">
                            <NavLink
                                to='/persons'
                                activeClassName={classes.active}
                            > Peronnses</NavLink> Détaille  de  la personne
                        </Typography>
                        <Typography component="p">
                            Détaille  de  la personne
                        </Typography>

                        <div style={{ float: 'right' }}>
                            <Tooltip id="tooltip-fab" title="Ajouter une nouvelle personne">

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.enableEditMode}
                                            onChange={this.handleEnableEditMode}
                                            value="enableEditMode"
                                        />
                                    }
                                    label="Enable edit mode"
                                />

                            </Tooltip>
                        </div>
                        <Form>
                            <FormControl
                                className={classes.formControl}
                                error={touched.title && errors.title ? true : false}
                            >
                                <TextField
                                    id="select-title-native"
                                    select
                                    label="Titre académique"
                                    name="title"
                                    className={classes.textField}
                                    style={{width:150}}
                                    value={values.title}
                                    onChange={handleChange}
                                    SelectProps={{
                                        native: true,
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}

                                    margin="normal"
                                >
                                    <option value="-1"> </option>
                                    {thesaurus[types.REALM_TITLE] && thesaurus[types.REALM_TITLE].map(option => (
                                        <option key={option.id} value={option.code}>
                                            {option.designation}
                                        </option>
                                    ))}

                                </TextField>
                            </FormControl>

                            <FormControl
                                className={classes.formControl}
                                error={touched.firstName && errors.firstName ? true : false}
                            >
                                <InputLabel htmlFor="firstName">Prénom</InputLabel>
                                <Input
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
                                <InputLabel htmlFor="lastName">Nom</InputLabel>
                                <Input
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

                            <FormControl
                                className={classes.formControl}
                                error={touched.address1 && errors.address1 ? true : false}
                            >
                                <InputLabel htmlFor="address1">Rue et numéro</InputLabel>
                                <Input
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


                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="select-gender-native"
                                    name="genderId"
                                    select
                                    label="Genre"
                                    className={classes.textField}
                                    style={{width:150}}
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

                                    {thesaurus[types.REALM_GENDER] ? thesaurus[types.REALM_GENDER].map(option => (
                                        <option key={option.id} value={option.code}>
                                            {option.designation}
                                        </option>
                                    )): <option value="-1"></option>}
                                </TextField>
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="select-language-native"
                                    name="languageId"
                                    select
                                    label="Langue"
                                    className={classes.textField}
                                    style={{width:150}}
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

                                    {thesaurus[types.REALM_LANGUAGE] ? thesaurus[types.REALM_LANGUAGE].map(option => (
                                        <option key={option.id} value={option.code}>
                                            {option.designation}
                                        </option>
                                    )): <option value="-1"></option>}
                                </TextField>
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="date"
                                    label="Birthday"
                                    type="date"
                                    defaultValue="2017-05-24"
                                    className={classes.textField}
                                    value={values.dateOfBirth}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                            </FormControl>



                            <FormControl
                                className={classes.formControl}
                                error={touched.password && errors.password ? true : false}
                                aria-describedby="password-text"
                            >
                                <InputLabel htmlFor="password">Password</InputLabel>

                                <Input
                                    id="password"
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={classes.textField}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="Toggle password visibility"
                                                onClick={this.handleClickShowPassword}
                                                onMouseDown={this.handleMouseDownPassword}
                                            >
                                                {this.state.showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />

                                {touched.password &&
                                errors.password && (
                                    <FormHelperText id="password-text">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <br />
                            <Button
                                variant="outlined"
                                color="primary"
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                className={classes.button}
                            >
                               Login
                            </Button>
                        </Form>

                    </Paper>


            </div>
        );
    }
}

const PersonForm = withFormik({
    // we can passe the default values props from the parent component - useful for edit
    mapPropsToValues({firstName, lastName, username, password , person}) {
        return {
            title:     person.data && person.data.titleId ? person.data.titleId: '',
            countryId: person.data && person.data.countryId? person.data.countryId: '',
            genderId: person.data && person.data.genderId? person.data.genderId: '',
            languageId: person.data && person.data.languageId? person.data.languageId: '',
            dateOfBirth:  person.data? person.data.dateOfBirth:'' || '',
            firstName: person.data? person.data.firstName:'' || '',
            lastName:  person.data? person.data.lastName:'' || '',
            username: username || '',
            password: password || ''
        };
    },
    handleSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
        // let's suppose that we do a server validtion call
        props.initiateLogin();
        props.login(values);
        setSubmitting(false);
    },
    validationSchema: object().shape({
        username: string().required('username is required ..'),
        password: string()
            .min(5, 'passowrd must be 5 or longer')
            .required('Password is required ...')
    })
})(Person);

PersonForm.propTypes = {
    classes: PropTypes.object.isRequired
};
const mapStateToProps = state =>({
    person: state.person,
    thesaurus: state.thesaurus
} );

export default connect(mapStateToProps, { ...personActions, ...thesaurusActions })(
    withErrorHandler(withStyles(styles)(PersonForm), axios)
);
