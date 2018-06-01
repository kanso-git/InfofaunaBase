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
import  './Person.css';
import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';
import Spinner from'../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-infofauna';
import { personActions, thesaurusActions } from '../../../store/actions';
import * as types from '../../../store/actions/Types';
import {NavLink, Redirect} from 'react-router-dom';

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
        enableEditMode:false,
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

        console.log("isSubmitting:"+isSubmitting);
        console.log("isValid:"+isValid)

        return (
            <div className="PersonContainer">

                    <Paper className={classes.root} elevation={4}>
                        <Typography variant="headline" component="h3">
                           Détail personne
                        </Typography>

                        <div style={{ float: 'right' }}>
                            <Tooltip id="tooltip-fab" title="Ajouter une nouvelle personne">

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
                                    Information personnelle
                                </Typography>

                                <FormControl
                                    className={classes.formControl}
                                    error={touched.title && errors.title ? true : false}
                                >
                                    <TextField
                                        disabled={!this.state.enableEditMode}
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
                                    <InputLabel htmlFor="firstName">*Prénom</InputLabel>
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
                                    <InputLabel htmlFor="lastName">*Nom</InputLabel>
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
                                        label="*Genre"
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
                                        disabled={!this.state.enableEditMode}
                                        id="select-language-native"
                                        name="languageId"
                                        select
                                        label="*Langue"
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
                                        disabled={!this.state.enableEditMode}
                                        id="date"
                                        label="Birthday"
                                        name="dateOfBirth"
                                        type="date"
                                        onChange={handleChange}
                                        className={classes.textField}
                                        value={values.dateOfBirth}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

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

const PersonForm = withFormik({
    // we can passe the default values props from the parent component - useful for edit
    mapPropsToValues({firstName, lastName, username, password , person}) {
        return {
            title:        person.data && person.data.titleId ? person.data.titleId: '',
            countryId:    person.data && person.data.countryId? person.data.countryId: '',
            genderId:     person.data && person.data.genderId? person.data.genderId: '',
            languageId:   person.data && person.data.languageId? person.data.languageId: '',
            dateOfBirth:  person.data && person.data.dateOfBirth ? moment(person.data.dateOfBirth).format('YYYY-MM-DD'): '',
            firstName:    person.data && person.data.firstName? person.data.firstName: '',
            lastName:     person.data && person.data.lastName? person.data.lastName: '',
            proPhone:     person.data && person.data.proPhone? person.data.proPhone: '',
            mobilePhone:  person.data && person.data.mobilePhone? person.data.mobilePhone: '',
            privatePhone: person.data && person.data.privatePhone? person.data.privatePhone: '',
            email:        person.data && person.data.email? person.data.email: '',
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
