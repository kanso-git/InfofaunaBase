import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import classNames from 'classnames';
import SwitchCtrl from '../UI/SwitchCtrl';
import * as types from '../../../../store/actions/Types';
import Divider from '@material-ui/core/es/Divider/Divider';
import Lock from '@material-ui/icons/Lock';


const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250
    },
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3
    }),
    column: {
        flexBasis: '50%'
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
    secondaryHeading: {
        paddingTop: 12,
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    wrapper: {
        width: '100%',
        marginTop: 30
    },
    chkRoot: {
        color: green[600],
        '&$checked': {
            color: green[500]
        }
    },
    checked: {}
});

class Role extends Component {
    renderGroupInfo = (info, groups) => {
        const {classes} = this.props;

        return (
            <Fragment>
                <ExpansionPanelDetails className={classes.details}>
                    <div className={classes.column}>
                        <FormControlLabel
                            control={
                                <SwitchCtrl
                                    checked={!groups.filter(g => g.selected === false).length > 0}
                                    writableFlag={!groups.filter(g => g.writable === false).length > 0}
                                    exportableFlag={this.props.exportableFlag}
                                    writeFalg
                                    exportRoleId={this.props.exportRoleId}
                                    id={'' + this.props.id}
                                    value={this.props.code}
                                    color="primary"
                                    label="Select all groups"
                                    handleChange={this.props.groupChangeAll}
                                    writeFlagChange={this.props.groupWriteChangeAll}
                                    disabled={this.props.disabled}
                                    exportChange={this.props.exportChange}
                                />
                            }
                            style={{marginLeft: 40, marginTop: 0}}
                        />
                    </div>
                    <div className={classNames(classes.column, classes.helper)}>
                        <Typography variant="caption">{this.props.description}</Typography>
                    </div>
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    <FormGroup row style={{paddingLeft: 50}}>
                        {groups.map(g => {
                            return (
                                <div style={{width: 400}} key={g.id}>
                                    <SwitchCtrl
                                        handleChange={this.props.groupChange}
                                        writeFlagChange={this.props.groupWriteChange}
                                        disabled={this.props.disabled}
                                        writableFlag={g.writable}
                                        writeFalg
                                        key={g.id}
                                        id={'' + g.id}
                                        name={g.name}
                                        checked={g.selected}
                                        label={g.name + ' (' + g.description + ')'}
                                    />
                                </div>
                            );
                        })}
                    </FormGroup>
                </ExpansionPanelActions>
            </Fragment>
        );
    };

    renderGroupNameOrNumber = () => {
        const selectedGroups = this.props.groups.filter(g => g.selected);
        if (selectedGroups.length === 1) {
            return ' (' + this.props.groups[0].name + ')';
        } else if (selectedGroups.length > 1) {
            return ' (' + selectedGroups.length + ' Groups)';
        } else {
            return '';
        }
    };
    renderSelectionIndicator = () => {

        if (this.props.readOnly || this.props.readOnlyAndSelected) {
            if (this.props.isSelected || this.props.readOnlyAndSelected) {
                return (
                    <Fragment>
                        <Lock style={{color: 'orange', fontSize: 28, opacity: 0.6, marginTop: 10, marginRight: 10}}/>
                        <SwitchCtrl
                            checked={true}
                            id={'' + this.props.id}
                            disabled={true}
                            label={this.props.application.code + ' / ' + this.props.name}
                        />
                    </Fragment>
                )
            } else {
                // read only but not selected
                return (
                    <Fragment>
                        <Lock style={{color: 'orange', fontSize: 28, opacity: 0.6, marginTop: 10, marginRight: 10}}/>
                        <SwitchCtrl
                            checked={false}
                            id={'' + this.props.id}
                            disabled={true}
                            label={this.props.application.code + ' / ' + this.props.name}
                        />
                    </Fragment>
                )
            }

        } else {
            // means readOnly is false and readOnlyAndSelected is false or null
            return (
                <Fragment>
                    <SwitchCtrl
                        checked={this.props.isSelected}
                        id={'' + this.props.id}
                        disabled={this.props.disabled}
                        handleChange={this.props.roleChange}
                        label={this.props.application.code + ' / ' + this.props.name}
                        extraMagrinLeft
                    />
                </Fragment>
            )
        }
    }
    renderCustomPanel = () => {
        const {isSelected, classes} = this.props;
        if (this.props.groupFlag !== types.USER_GRP_DEFINE) {
            return (
                <ExpansionPanel defaultExpanded={true} expanded={true}>
                    <ExpansionPanelSummary>
                        {this.renderSelectionIndicator()}
                        <Typography className={classes.secondaryHeading}>
                            {this.props.description}
                        </Typography>
                    </ExpansionPanelSummary>
                </ExpansionPanel>
            );
        } else {
            return (
                <ExpansionPanel defaultExpanded={false}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <SwitchCtrl
                            checked={isSelected}
                            disabled={this.props.disabled}
                            id={'' + this.props.id}
                            handleChange={this.props.roleChange}
                            label={
                                this.props.application.code +
                                ' / ' +
                                this.props.name +
                                this.renderGroupNameOrNumber()
                            }
                            extraMagrinLeft
                        />
                    </ExpansionPanelSummary>
                    {this.renderGroupInfo(this.props.groupFlag, this.props.groups)}
                </ExpansionPanel>
            );
        }
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={this.props.isSameApp ? null : classes.wrapper}>
                {this.renderCustomPanel()}
            </div>
        );
    }
}

Role.propTypes = {};

export default withStyles(styles)(Role);
