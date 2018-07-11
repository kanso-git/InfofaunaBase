import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Form, withFormik} from 'formik';
import {object, string} from 'yup';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
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
import './user.css';
import withErrorHandler from '../../../components/withErrorHandler/withErrorHandler';
import axios from '../../../axios-infofauna';
import {thesaurusActions, userActions} from '../../../store/actions';
import * as types from '../../../store/actions/Types';
import * as authHelper from '../../../store/actions/AuthHelper';

import {NavLink} from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Divider from '@material-ui/core/Divider';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Audit from '../../Audit/Audit';
import {translate} from 'react-i18next';
import Dialog from '../../Dialog/Dialog';
import Role from './Roles/Role';

const NotificationSystem = require('react-notification-system');

let suggestionsPerson = [];

class Option extends React.Component {
    handleClick = event => {
        this.props.onSelect(this.props.option, event);
    };

    render() {
        const {children, isFocused, isSelected, onFocus} = this.props;

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
    const {classes, ...other} = props;

    return (
        <Select
            optionComponent={Option}
            noResultsText={<Typography>{AUTOCOMPLET_No_results_found}</Typography>}
            arrowRenderer={arrowProps => {
                return arrowProps.isOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>;
            }}
            clearRenderer={() => <ClearIcon/>}
            valueComponent={valueProps => {
                const {value, children, onRemove} = valueProps;

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
                            deleteIcon={<CancelIcon onTouchEnd={onDelete}/>}
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

    iOSSwitchBase: {
        '&$iOSChecked': {
            color: theme.palette.common.white,
            '& + $iOSBar': {
                backgroundColor: '#52d869'
            }
        },
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp
        })
    },
    iOSChecked: {
        transform: 'translateX(15px)',
        '& + $iOSBar': {
            opacity: 1,
            border: 'none'
        }
    },
    iOSBar: {
        borderRadius: 13,
        width: 42,
        height: 26,
        marginTop: -13,
        marginLeft: -21,
        border: 'solid 1px',
        borderColor: theme.palette.grey[400],
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border'])
    },
    iOSIcon: {
        width: 24,
        height: 24
    },
    iOSIconChecked: {
        boxShadow: theme.shadows[1]
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

let AUTOCOMPLET_No_results_found;
let User_Name_is_required;
let User_Username_is_required;
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
        // console.log('componentDidMount...');
        this.notificationInput = React.createRef();
        this.loadData();
    }

    loadData = async () => {
        const {id} = this.props.match.params;

        if (id && !this.props.user.ongoingRequest ) {
            this.props.initiateFetchUser();
            await this.props.fetchUser(id);
            this.props.loadRolesAndGroupsData(id);
            this.props.loadUserAdditionalListData();
        } else if (!id) {
            this.setState(() => ({
                enableEditMode: true,
                loading: true
            }));
            this.props.loadRolesAndGroupsData();
            this.props.loadUserAdditionalListData();
            this.setState(() => ({
                loading: false
            }));
        }
    };

    isNotTheSame = () => {
        if (this.props.user.data) {
            const {id} = this.props.match.params;
            if (this.props.user.data.id === parseInt(id)) {
                return false;
            }
        }
        return true;
    };

    componentWillReceiveProps(nextProps) {
        // console.log('user componentWillReceiveProps .............');
        // console.log(nextProps);
        if (nextProps.user.opreationType === types.ADD_OPREATION_TYPE) {
            const {id} = nextProps.match.params;
            if (id && id != this.props.match.params.id) {
                this.props.fetchUser(id);
            } else if (!id) {
                const {t} = this.props;
                this.addNofification(
                    t('Notification Body add success'),
                    t('Notification Title success'),
                    'success'
                );
            }
        }

        if (nextProps.user.opreationType === types.MODIFY_OPREATION_TYPE) {
            const {t} = this.props;
            this.addNofification(
                t('Notification Body modify success'),
                t('Notification Title success'),
                'success'
            );
        }
    }

    addNofification = (message, title, level) => {
        if (this.notificationInput.current && !this.httpError) {
            this.notificationInput.current.addNotification({
                title: title,
                message: message,
                level: level,
                position: 'tr'
            });
        }
    };

    handleEnableEditMode = () => {
        this.setState(prevState => ({enableEditMode: !prevState.enableEditMode}));
    };

    handleDelete = id => {
        this.props.deleteUser(id);
        setTimeout(() => this.props.history.push('/users'), 200);
    };

    renderAppRole = (role, roleGroups, setFieldValue) => {

        let exportRoleId = null;
        let selectedGroups = null;
        let exportableFlag = false;
        const userRoleSelectionStatus = roleGroups.findIndex(r => parseInt(r.roleId) === parseInt(role.id)) !== -1 ? true : false;

        if (role.groupFlag === types.USER_GRP_DEFINE) {

            const exportRoleObj =   this.props.user.roles.filter(
                r => r.application.id === role.application.id && r.name ==='EXPORT'
            );
            exportRoleId =exportRoleObj && exportRoleObj[0] ?exportRoleObj[0].id: null;

           const  userExportableObjIndex =  roleGroups.findIndex(ug => parseInt(ug.roleId) === parseInt(exportRoleId));

            exportableFlag = userExportableObjIndex !== -1 ? true: false;

            selectedGroups = this.props.user.groups.map(g => {
                // check if this group is selected
                const group = roleGroups.filter(
                    ug => parseInt(ug.roleId) === parseInt(role.id) && parseInt(ug.groupId) === parseInt(g.id)
                );

                const isSelected = group && group[0] ? true : false;
                const isWritable = isSelected? group[0].writable: false;

                return {
                    ...g,
                    selected: isSelected ,
                    writable: isWritable
                };
            });
        }

        // isSameApp is used to give a space between to # apps
        let isSameApp;
        if (this.currentApp) {
            if (this.currentApp === role.application.code) {
                isSameApp = true;
            } else {
                this.currentApp = role.application.code;
                isSameApp = false;
            }
        } else {
            this.currentApp = role.application.code;
            isSameApp = false;
        }

        return (
            <Role
                key={role.id}
                {...role}
                disabled={!this.state.enableEditMode}
                isSelected={userRoleSelectionStatus}
                isSameApp={isSameApp}
                exportableFlag={exportableFlag}
                exportRoleId={exportRoleId}
                groups={selectedGroups}
                roleChange={e => this.handleRoleChange(e, roleGroups, setFieldValue)}
                groupChangeAll={e =>
                    this.handleGroupChangeAll(e, roleGroups, setFieldValue)
                }
                groupWriteChangeAll={e =>
                    this.handleWriteGroupChangeAll(e, roleGroups, setFieldValue)
                }

                groupChange={e =>
                    this.handleGroupChange(
                        e,
                        role.id,
                        setFieldValue,
                        roleGroups,
                        this.props.user.groups
                    )
                }

                groupWriteChange={e =>
                    this.handleWriteGroupChange(
                        e,
                        role.id,
                        setFieldValue,
                        roleGroups
                    )
                }

                exportChange={e =>
                    this.handleExportChange(e, roleGroups, setFieldValue)
                }
            />
        );
    };

    // when user select/unselect a role
    // role with groupFlag = "N/A" =>
    // role with groupFlag = "UGD" => off => on is not allowed , off=>on is allowed
    handleRoleChange = (e, roleGroups, setFieldValueFn) => {
        const {id, checked} = e.currentTarget; // checked is the futur status
        const selectedRole = this.props.user.roles.filter(r => parseInt(r.id) === parseInt(id));

        if (selectedRole[0].groupFlag === types.USER_GRP_DEFINE) {

            // this means the check was off and the user check it
            if (checked) {
                // this is not allowed since the user has to define the groups
            } else {
                // else case : this means the check was on and the user uncheck it
                // remove all the selected groups with their writable flags
                const updateRoleGroups = roleGroups.filter(rg => !(parseInt(rg.roleId) === parseInt(id)));
                setFieldValueFn('roleGroups', updateRoleGroups);
            }
        }else if(selectedRole[0].groupFlag === types.NOT_APPLICABLE){

            if(checked){
                const roleALreadyExist = roleGroups.findIndex(
                    rg => parseInt(rg.roleId) === parseInt(id)
                );
                if (roleALreadyExist === -1) {
                    const updateRoleGroups = [
                        ...roleGroups,
                        {roleId: parseInt(id), groupId: null}
                    ];
                    setFieldValueFn('roleGroups', updateRoleGroups);
                }
            }else{
                const updateRoleGroups = roleGroups.filter(rg => !(parseInt(rg.roleId) === parseInt(id)));
                setFieldValueFn('roleGroups', updateRoleGroups);
            }

        }
    };

    // trigger the below function when user select all/ unselect all  groups
    handleGroupChangeAll = (e, roleGroups, setFieldValueFn) => {
        const {id, checked} = e.currentTarget;
        let updateRoleGroups = roleGroups;
        if (checked) {
            this.props.user.groups.map(g => {
                const groupALreadyExist = roleGroups.findIndex(
                    rg => parseInt(rg.roleId) === parseInt(id) && parseInt(rg.groupId) === parseInt(g.id)
                );
                if (groupALreadyExist === -1) {
                    updateRoleGroups = [
                        ...updateRoleGroups,
                        {roleId: parseInt(id), groupId: parseInt(g.id),  writable:false}
                    ];
                }
            });
            setFieldValueFn('roleGroups', updateRoleGroups);
        } else {
            updateRoleGroups = roleGroups.filter(rg => !(rg.roleId == id));
            setFieldValueFn('roleGroups', updateRoleGroups);
        }
    };

    // trigger the below function when user select all/ unselect write flag for all  groups
    // all groups already selected ..
    handleWriteGroupChangeAll = (e, roleGroups, setFieldValueFn) => {
        const {id, checked} = e.currentTarget;
        const updateRoleGroups = roleGroups.map(rg => {
            if(parseInt(rg.roleId) === parseInt(id)){
               return {
                   ...rg,
                   writable:checked
               }
            }
            return rg;
        });

        setFieldValueFn('roleGroups', updateRoleGroups);
    };

    // trigger the below function when user select/unselect a group
    handleGroupChange = (e, roleId, setFieldValueFn, roleGroups, allGroups) => {
        const {id} = e.currentTarget;
        
        const groupALreadyExist = roleGroups.findIndex(
            rg => parseInt(rg.roleId) === parseInt(roleId) && parseInt(rg.groupId) === parseInt(id)
        );
        let updateRoleGroups;
        if (groupALreadyExist !== -1) {
            // if exist
            updateRoleGroups = roleGroups.filter(
                rg => !(parseInt(rg.roleId) === parseInt(roleId) && parseInt(rg.groupId) === parseInt(id))
            );
        } else {
            // not exist  add it
            const groupToAdd = allGroups.find(rg => parseInt(rg.id) === parseInt(id));
            updateRoleGroups = [
                ...roleGroups,
                { roleId, groupId: groupToAdd.id, writable: false}
            ];
        }
        setFieldValueFn('roleGroups', updateRoleGroups);
    };

    // trigger the below function when user select/unselect a write on group
    handleWriteGroupChange = (e, roleId, setFieldValueFn, roleGroups) => {
        const {id,checked} = e.currentTarget;
        const updateRoleGroups = roleGroups.map(
            rg => {
                if(parseInt(rg.roleId) === parseInt(roleId) && parseInt(rg.groupId) === parseInt(id)){
                    return {
                        ...rg,
                        writable:checked
                    }
                }
                return rg;
            }
        );
        setFieldValueFn('roleGroups', updateRoleGroups);
    };

    handleExportChange = (e, roleGroups, setFieldValueFn ) => {
        const {id} = e.currentTarget;

        const exportALreadyExist = roleGroups.findIndex(
            rg => parseInt(rg.roleId) === parseInt(id)
        );
        let updateRoleGroups;
        if (exportALreadyExist !== -1) {
            // if exist remove it
            updateRoleGroups = roleGroups.filter(
                rg => !(parseInt(rg.roleId) === parseInt(id) )
            );
        } else {
            // not exist  add it
            updateRoleGroups = [
                ...roleGroups,
                {roleId:parseInt(id) , groupId: null}
            ];
        }
        setFieldValueFn('roleGroups', updateRoleGroups);
    };

    // delete btn visibility depends on the currentUser porfile Vs the displayed user and the mode of the page
    renderDeleteButton = ()=>{

        if(this.props.match.params.id && this.props.user.enableDelete){
            return(
                <Button
                    className={this.props.classes.button}
                    variant="raised"
                    color="secondary"
                    onClick={() => this.setState(() => ({dialog: true}))}
                >
                    {this.props.t('User Delete')}
                    <Delete className={this.props.classes.rightIcon}/>
                </Button>
            )
        }
    };

    render() {
        // console.log('user render .............');
        if (this.props.user.personsList) {
            suggestionsPerson = this.props.user.personsList.map(suggestion => ({
                value: suggestion.id,
                label: suggestion.name
            }));
        }
        const {classes} = this.props;
        const {
            values,
            errors,
            touched,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            isValid,
            thesaurus,
            user
        } = this.props;

        const {t, i18n} = this.props;
        AUTOCOMPLET_No_results_found = t('AUTOCOMPLET No results found');

        User_Name_is_required = t('User Name is required');
        User_Username_is_required = t('User Acronym is required');
        User_Phone_format_is_invalid = t('User Phone format is not valid');
        User_Email_format_is_invalid = t('User Email format is not valid');
        User_Url_format_is_invalid = t('User Url format is not valid');

        User_Country_is_required = t('User Country is required');
        User_Person_In_Charge_Function_is_required = t(
            'User Person In Charge is required'
        );
        User_Person_In_Charge_is_required = t(
            'User Person In Charge Function is required'
        );

        let auditData = {};
        if (user.data) {
            auditData = {...user.data.auditDTO};
        }

        if (this.props.user.ongoingRequest || this.state.loading) {
            return (
                <div className="UserContainer">
                    <Paper className={classes.root} elevation={4}>
                        <Typography variant="headline" component="h3">
                            {t('User Loading')}
                        </Typography>
                        <br/>
                        <br/>
                        <div className={{flexGrow: 1}}>
                            <LinearProgress/>
                            <br/>
                            <LinearProgress color="secondary"/>
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
                        {this.props.match.params.id ? (
                            <span className={classes.actualSite}> {t('User Details')}</span>
                        ) : (
                            <span className={classes.actualSite}> {t('User User New')}</span>
                        )}
                    </Typography>

                    {this.props.match.params.id &&
                    authHelper.currentUserManagerPermissionsArray().length>0 ? (
                        <div style={{float: 'right'}}>
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
                    ) : (
                        ''
                    )}
                    {this.props.match.params.id ? <Audit {...auditData} /> : ''}

                    <Form>
                        <br/>
                        <Paper className={classes.root} elevation={1}>
                            <Typography component="p">{t('User Info')}</Typography>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="person">{t('User Person')}</InputLabel>
                                <Input
                                    name="personId"
                                    disabled={!this.state.enableEditMode}
                                    inputComponent={SelectWrapped}
                                    value={values.personId}
                                    className={classes.textField}
                                    onChange={b => this.props.setFieldValue('personId', b)}
                                    onBlur={handleBlur}
                                    placeholder={t('User Person')}
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

                            <FormControl
                                className={classes.formControl}
                                error={touched.username && errors.username ? true : false}
                            >
                                <InputLabel htmlFor="name">*{t('User Username')}</InputLabel>
                                <Input
                                    disabled={!this.state.enableEditMode}
                                    id="username"
                                    type="input"
                                    name="username"
                                    className={classes.textField}
                                    style={{width: 400}}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                />
                                {touched.username &&
                                errors.username && (
                                    <FormHelperText id="name-text">
                                        {errors.username}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                className={classes.formControl}
                                error={touched.languageId && errors.languageId ? true : false}
                            >
                                <TextField
                                    disabled={!this.state.enableEditMode}
                                    id="select-language-native"
                                    name="languageId"
                                    select
                                    label={`*${t('Person Language')}`}
                                    className={classes.textField}
                                    style={{width: 150}}
                                    value={values.languageId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    SelectProps={{
                                        native: true,
                                        MenuProps: {
                                            className: classes.menu
                                        }
                                    }}
                                    margin="normal"
                                >
                                    <option value="-1"></option>
                                    {this.props.user.languagesList ? (
                                        this.props.user.languagesList.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.designation}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="-1"/>
                                    )}
                                </TextField>
                                {touched.languageId &&
                                errors.languageId && (
                                    <FormHelperText id="languageId-text">
                                        {errors.languageId}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Divider/>
                            <FormControlLabel
                                control={
                                    <Switch
                                        id="ldap"
                                        name="ldap"
                                        disabled={!this.state.enableEditMode}
                                        checked={values.ldap}
                                        onChange={handleChange}
                                        value={values.ldap.toString()}
                                        classes={{
                                            switchBase: classes.iOSSwitchBase,
                                            bar: classes.iOSBar,
                                            icon: classes.iOSIcon,
                                            iconChecked: classes.iOSIconChecked,
                                            checked: classes.iOSChecked
                                        }}
                                        disableRipple
                                    />
                                }
                                label={t('Authenticated by LDAP')}
                            />

                            {!values.ldap ? (
                                <Fragment>
                                    <FormControl
                                        className={classes.formControl}
                                        error={touched.password && errors.password ? true : false}
                                    >
                                        <InputLabel htmlFor="password">
                                            *{t('User Password')}
                                        </InputLabel>
                                        <Input
                                            disabled={!this.state.enableEditMode}
                                            id="password"
                                            type="input"
                                            name="password"
                                            className={classes.textField}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                        />
                                        {touched.password &&
                                        errors.password && (
                                            <FormHelperText id="password-text">
                                                {errors.password}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    <FormControl
                                        className={classes.formControl}
                                        error={touched.passwordConfirm && errors.passwordConfirm} >
                                        <InputLabel htmlFor="name">
                                            *{t('User Confirm Password')}
                                        </InputLabel>
                                        <Input
                                            disabled={!this.state.enableEditMode}
                                            id="passwordConfirm"
                                            type="input"
                                            name="passwordConfirm"
                                            className={classes.textField}
                                            style={{width: 400}}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.passwordConfirm}
                                        />
                                        {touched.passwordConfirm &&
                                        errors.passwordConfirm && (
                                            <FormHelperText id="passwordConfirm-text">
                                                {errors.passwordConfirm}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Fragment>
                            ) : (
                                ''
                            )}
                        </Paper>

                        <Paper className={classes.root} elevation={1}>
                            <Typography component="p">Roles</Typography>
                            {this.props.user.roles
                                ? this.props.user.roles
                                    .filter(g => g.name.indexOf('EXPORT') === -1)
                                    .sort((a, b) =>
                                        ('' + a.application.code + a.name).localeCompare(
                                            b.application.code + b.name
                                        )
                                    )
                                    .map(r =>
                                        this.renderAppRole(r, values.roleGroups, setFieldValue)
                                    )
                                : ''}
                            <br/>
                        </Paper>
                        <br/>
                        {this.state.enableEditMode &&
                        authHelper.currentUserManagerPermissionsArray().length>0 && (
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button
                                    className={classes.button}
                                    variant="raised"
                                    type="submit"
                                    disabled={isSubmitting || !isValid}
                                    size="small"
                                >
                                    <Save className={classNames(classes.rightIcon)}/>
                                    {t('User Save')}
                                </Button>
                                {this.renderDeleteButton()}

                            </div>
                        )}
                    </Form>
                </Paper>
                <NotificationSystem ref={this.notificationInput}/>
                {this.state.dialog ? (
                    <Dialog
                        handleClose={() => this.setState(() => ({dialog: false}))}
                        handleDelete={() => this.handleDelete(this.props.match.params.id)}
                    />
                ) : null}
            </div>
        );
    }
}

const UserForm = withFormik({
    // we can passe the default values props from the parent component - useful for edit
    enableReinitialize: true,

    mapPropsToValues({user}) {
        return {
            username: user.data && user.data.username ? user.data.username : '',
            personId: user.data && user.data.person ? user.data.person.id : '',
            password:'',
            passwordConfirm:'',
            languageId: user.data && user.data.languageId ? user.data.languageId : '',
            ldap: user.data && user.data.ldap ? user.data.ldap : false,
            roleGroups: user.data && user.data.roleGroups ? user.data.roleGroups : []
        };
    },
    async handleSubmit(values, {props, resetForm, setErrors, setSubmitting}) {
        // console.log('**************************');
        this.httpError = null;
        if (props.match.params.id) {
            const {id} = props.match.params;
            const updatedRoleGroups = values.roleGroups.map(rg =>{
                const {roleId, groupId} = rg;

                let row = null;
                if(groupId != null){
                    row = props.user.data.roleGroups.find(r=>parseInt(r.roleId) === parseInt(roleId) && parseInt(r.groupId) === parseInt(groupId) );
                }else{
                    row = props.user.data.roleGroups.find(r=>parseInt(r.roleId) === parseInt(roleId));
                }

                return {
                    id: row ? row.id : null,
                    userId:parseInt(props.match.params.id),
                    roleId:roleId,
                    groupId:rg.groupId,
                    writable: rg.writable
                }
            });
            let deletedRoleGroups = [];
            props.user.data.roleGroups.forEach(rg=>{
                const {id, roleId, groupId} = rg;
                let row = null;
                if(groupId != null){
                    row = updatedRoleGroups.find(r=>parseInt(r.roleId) === parseInt(roleId) && parseInt(r.groupId) === parseInt(groupId) );
                }else{
                    row = updatedRoleGroups.find(r=>parseInt(r.roleId) === parseInt(roleId));
                }
                if(!row){
                    const newRg= {
                        ...rg,
                        deleted:true
                    }
                    deletedRoleGroups.push(newRg) ;
                }
            });
            values.roleGroups = deletedRoleGroups.length >0 ? [...updatedRoleGroups,...deletedRoleGroups] :[...updatedRoleGroups];
            console.log(JSON.stringify(values, null, 3));

             try{
                  await props.updateUser(id, values);
                  await props.fetchUser(id);
                  setSubmitting(false);
             }catch(e){
                 this.httpError = e;
                 throw e;
             }
        } else {
            try{
                const newroleGroups = values.roleGroups.map(rg =>{
                    const {roleId} = rg;
                    return {
                        id: null,
                        userId:null,
                        roleId:roleId,
                        groupId:rg.groupId,
                        writable: rg.writable?rg.writable: false
                    }
                });
                debugger
               values.roleGroups =newroleGroups.length >0 ? [...newroleGroups] : [];
               console.log(JSON.stringify(values, null, 3));
               const response = await props.addNewUser(values);
               if(response && response.headers) {
                   setTimeout(() => props.history.push(response.headers.location), 200);
               }
            }catch(e){
                this.httpError = e;
                throw e;
            }
        }
    },
    isInitialValid: props => (props.match.params.id ? true : false),
    validationSchema: () =>
        object().shape({
            username: string().required(User_Username_is_required)
        })
})(User);

UserForm.propTypes = {
    classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    user: state.user ? state.user : {},
    thesaurus: state.thesaurus
});

export default connect(mapStateToProps, {
    ...userActions,
    ...thesaurusActions
})(
    withErrorHandler(
        withStyles(styles)(translate('translations')(UserForm)),
        axios
    )
);
