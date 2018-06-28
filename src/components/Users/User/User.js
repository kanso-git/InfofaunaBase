import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik } from 'formik';
import { object, string, number } from 'yup';
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
import './user.css';
import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-infofauna';
import { userActions, thesaurusActions } from '../../../store/actions';
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
import Audit from "../../Audit/Audit";
import { translate, Trans } from 'react-i18next';
import Dialog from '../../Dialog/Dialog';
const NotificationSystem = require('react-notification-system');

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

let AUTOCOMPLET_No_results_found ;
let User_Name_is_required;
let User_Acronym_is_required;
let User_Country_is_required;
let User_Person_In_Charge_Function_is_required;
let User_Person_In_Charge_is_required;

let User_Phone_format_is_invalid;
let User_Email_format_is_invalid;
let User_Url_format_is_invalid;




class User extends Component {
    state = {
        loading: false,
        enableEditMode: false
    };

    componentDidMount() {
        this.notificationInput = React.createRef();
        const { id } = this.props.match.params;

        if (id && !this.props.user.ongoingRequest && this.isNotTheSame()) {
            this.props.initiateFetchUser();
            this.loadThesaurusData();
            this.props.loadUserPersonListData();
            this.props.fetchUser(id);
        }else if(!id){
            this.setState(()=>({
                enableEditMode: true,
                loading: true
            }))
            this.loadThesaurusData();
            this.props.loadUserPersonListData();
            this.setState(()=>({
                loading: false
            }))
        }
    }

    loadThesaurusData = ()=> {
        if (!this.props.thesaurus[types.REALM_COUNTRY]) {
            this.props.fetchThesaurus(types.REALM_COUNTRY);
        }
        if (!this.props.thesaurus[types.REALM_FUNCTION]) {
            this.props.fetchThesaurus(types.REALM_FUNCTION);
        }
    }

    isNotTheSame =()=>{
        if(this.props.user.data ){
            const { id } = this.props.match.params;
            if(this.props.user.data.id === parseInt(id)){
                return false
            }
        }
        return true;
    }

    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps .............');
        console.log(nextProps);
        if( nextProps.user.opreationType === types.ADD_OPREATION_TYPE ){
            const {id} = nextProps.match.params;
            if(id && id != this.props.match.params.id){
                this.props.fetchUser(id);
            }else if(!id){
                const { t } = this.props;
                this.addNofification(
                    t('Notification Body add success'),
                    t('Notification Title success'),
                    'success');
            }

        }

        if(nextProps.user.opreationType === types.MODIFY_OPREATION_TYPE){
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
        this.props.deleteUser(id);
        setTimeout(()=>this.props.history.push('/Users'), 200);
    }


    render() {
        if (this.props.user.personsList) {
            suggestionsPerson = this.props.user.personsList.map(
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
            thesaurus,
            User
        } = this.props;

        const {t,i18n } = this.props;
        AUTOCOMPLET_No_results_found  = t('AUTOCOMPLET No results found');

        User_Name_is_required =t('User Name is required');
        User_Acronym_is_required =t('User Acronym is required');
        User_Phone_format_is_invalid =t('User Phone format is not valid');
        User_Email_format_is_invalid =t('User Email format is not valid');
        User_Url_format_is_invalid =t('User Url format is not valid');

        User_Country_is_required = t('User Country is required');
        User_Person_In_Charge_Function_is_required=t('User Person In Charge is required');
        User_Person_In_Charge_is_required=t('User Person In Charge Function is required');

        let auditData={};
        if(user.data){
            auditData={...user.data.auditDTO}
        }


        if (this.props.user.ongoingRequest || this.state.loading) {
            return (
                <div className="UserContainer">
                    <Paper className={classes.root} elevation={4}>
                        <Typography variant="headline" component="h3">
                            {t('User Loading')}
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
            <div className="UserContainer">
                <Paper className={classes.root} elevation={4}>
                    <Typography variant="headline" component="h3">
                        <NavLink to="/Users" className={classes.backLink}>
                            {t('User Users')}
                        </NavLink>
                        &nbsp;>&nbsp;
                        {this.props.match.params.id ?
                            <span className={classes.actualSite}> {t('User Detail')}</span>
                            :  <span className={classes.actualSite}> {t('User User New')}</span> }
                    </Typography>

                    {this.props.match.params.id ?
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
                        :''}
                    { this.props.match.params.id ?  <Audit {...auditData}/> :''}

                    <Form>
                        <br />
                        <Paper className={classes.root} elevation={1}>
                            <Typography component="p">{t('User Name and acronym')}</Typography>

                            <FormControl
                                className={classes.formControl}
                                error={touched.acronym && errors.acronym ? true : false}
                            >
                                <InputLabel htmlFor="acronym">*{t('User Acronym')}</InputLabel>
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
                                <InputLabel htmlFor="name">*{t('User Name')}</InputLabel>
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
                            <Typography component="h4">{t('User Address and contact')}</Typography>

                            <FormControl
                                className={classes.formControl}
                                error={touched.address1 && errors.address1 ? true : false}
                            >
                                <InputLabel htmlFor="address1">{t('User Street and number')}</InputLabel>
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
                                <InputLabel htmlFor="address2">{t('User Additional information')}</InputLabel>
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
                                <InputLabel htmlFor="zipCode">{t('User Postal code')}</InputLabel>
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
                                    label={t('User Country')}
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
                                    <option value="-1" />
                                    {thesaurus[types.REALM_COUNTRY] && (
                                        thesaurus[types.REALM_COUNTRY].map(option => (
                                            <option key={option.id} value={option.codeValue}>
                                                {option.designation}
                                            </option>
                                        ))
                                    ) }
                                </TextField>
                            </FormControl>

                            <FormControl className={classes.formControl}  error={touched.phone && errors.phone ? true : false}>
                                <InputLabel htmlFor="phone">{t('User Phone')}</InputLabel>
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
                                {touched.phone &&
                                errors.phone && (
                                    <FormHelperText id="phone-text">{errors.phone}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl className={classes.formControl}  error={touched.fax && errors.fax ? true : false}>
                                <InputLabel htmlFor="mobilePhone">{t('User Fax')}</InputLabel>
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
                                {touched.fax &&
                                errors.fax && (
                                    <FormHelperText id="fax-text">{errors.fax}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl className={classes.formControl} error={touched.url && errors.url ? true : false}>
                                <InputLabel htmlFor="url">{t('User Url')}</InputLabel>
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

                        </Paper>

                        <Paper className={classes.root} elevation={1}>
                            <Typography component="p">{t('User Person in charge')}</Typography>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="personInChargeId">*{t('User Person fulName')}</InputLabel>
                                <Input
                                    name="personInChargeId"
                                    disabled={!this.state.enableEditMode}
                                    inputComponent={SelectWrapped}
                                    value={values.personInChargeId}
                                    className={classes.textField}
                                    onChange={b =>
                                        this.props.setFieldValue('personInChargeId', b)
                                    }
                                    onBlur={handleBlur}
                                    placeholder={t('User Person fulName search')}
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
                                    label={t('User Person function')}
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
                                    <option value="-1" />
                                    {thesaurus[types.REALM_FUNCTION] && (
                                        thesaurus[types.REALM_FUNCTION].map(option => (
                                            <option key={option.id} value={option.codeValue}>
                                                {option.designation}
                                            </option>
                                        ))
                                    ) }
                                </TextField>
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
                                    {t('User Save')}
                                </Button>

                                { this.props.match.params.id
                                    ?
                                    <Button
                                        className={classes.button}
                                        variant="raised"
                                        color="secondary"
                                        onClick={() => this.setState(()=>({dialog: true})) }
                                    >
                                        {t('User Delete')}
                                        <Delete className={classes.rightIcon} />
                                    </Button>: ''
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

const UserForm = withFormik({
    // we can passe the default values props from the parent component - useful for edit
    enableReinitialize: true,

    mapPropsToValues({ firstName, lastName, username, password, user }) {
        return {
            acronym:
                user.data && user.data.acronym
                    ? user.data.acronym
                    : '',
            name:
                user.data && user.data.name ? user.data.name : '',
            address1:
                user.data && user.data.address1
                    ? user.data.address1
                    : '',
            address2:
                user.data && user.data.address2
                    ? user.data.address2
                    : '',

            zipCode:
                user.data && user.data.zipCode
                    ? user.data.zipCode
                    : '',
            locality:
                user.data && user.data.locality
                    ? user.data.locality
                    : '',

            countryId:
                user.data && user.data.countryId
                    ? user.data.countryId
                    : -1,
            personInChargeId:
                user.data && user.data.personInChargeId
                    ? user.data.personInChargeId
                    : -1,
            personInChargeFunctionId:
                user.data && user.data.personInChargeFunctionId
                    ? user.data.personInChargeFunctionId
                    : -1,

            phone:
                user.data && user.data.phone
                    ? user.data.phone
                    : '',
            fax: user.data && user.data.fax ? user.data.fax : '',
            url: user.data && user.data.url ? user.data.url : ''
        };
    },
    async handleSubmit(values, { props, resetForm, setErrors, setSubmitting }) {
        console.log(JSON.stringify(values, null,3));
        if(props.match.params.id){
            const { id } = props.match.params;
            await props.updateUser(id, values);
            await props.fetchUser(id);
            setSubmitting(false);
        }else{
            const response= await props.addNewUser(values);
            setTimeout(()=>props.history.push(response.headers.location), 200);
        }
    },
    isInitialValid: (props)=> props.match.params.id ? true:false,
    validationSchema: () =>object().shape({
        acronym: string().required(User_Acronym_is_required),
        name: string().required(User_Name_is_required),
        countryId: number().min(1).required(User_Country_is_required),
        personInChargeId: number().min(1).required(User_Person_In_Charge_is_required),
        personInChargeFunctionId:number().min(1).required(User_Person_In_Charge_Function_is_required),
        phone: string().min(10, User_Phone_format_is_invalid),
        fax: string().min(10, User_Phone_format_is_invalid),
        url: string().url(User_Url_format_is_invalid)
    })
})(User);

UserForm.propTypes = {
    classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    user: state.user,
    thesaurus: state.thesaurus
});

export default connect(mapStateToProps, {
    ...userActions,
    ...thesaurusActions
})(withErrorHandler(withStyles(styles)(translate('translations')(UserForm)), axios));
