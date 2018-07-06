import React, {Fragment} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import green from '@material-ui/core/colors/green';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
    root: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },
    },
    checked: {},
    iOSSwitchBase: {
        '&$iOSChecked': {
            color: theme.palette.common.white,
            '& + $iOSBar': {
                backgroundColor: '#52d869',
            },
        },
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp,
        }),
    },
    iOSChecked: {
        transform: 'translateX(15px)',
        '& + $iOSBar': {
            opacity: 1,
            border: 'none',
        },
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
        transition: theme.transitions.create(['background-color', 'border']),
    },
    iOSIcon: {
        width: 24,
        height: 24,
    },
    iOSIconChecked: {
        boxShadow: theme.shadows[1],
    },
});

class SwitchCtrl extends React.Component {


    render(){
        const { classes } = this.props;
        const {checked, handleChange, disabled,label, id, name, writeFalg, exportFalg} = this.props;
        return (
            <Fragment>
                <FormControlLabel
                    control={
                        <Switch
                            id={id}
                            name={name}
                            classes={{
                                switchBase: classes.iOSSwitchBase,
                                bar: classes.iOSBar,
                                icon: classes.iOSIcon,
                                iconChecked: classes.iOSIconChecked,
                                checked: classes.iOSChecked,
                            }}
                            disableRipple
                            checked={checked}
                            onChange={handleChange}
                            value={name}
                            disabled={disabled}
                        />
                    }
                    label={label}
                />
                {exportFalg? (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={true}
                            value="checkedG"
                            classes={{
                                root: classes.root,
                                checked: classes.checked,
                            }}
                        />
                    }
                    label="Export"
                />):null}
                {(checked && writeFalg) ? (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={true}
                                value="checkedG"
                                classes={{
                                    root: classes.root,
                                    checked: classes.checked,
                                }}
                            />
                        }
                        label="Write"
                    />
                ): null}


            </Fragment>

        );
    }

};

export default withStyles(styles)(SwitchCtrl);