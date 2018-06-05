import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { translate, Trans } from 'react-i18next';
import moment from '../../moment-local';

import {NavLink, Redirect} from 'react-router-dom';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit ,
        overflowX: 'auto',
    },
    table: {
        minWidth: 500,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
});

const ROW_HEIGHT= 25;

const Audit = (props) => {
    const { classes } = props;
    const { t, i18n } = props;

    return (
        <div style={{width:'100%', marginTop:50, marginBottom:-20}}>
            <ExpansionPanel  defaultExpanded={false} >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{t('Audit Data creation and modification history')}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow style={{height:ROW_HEIGHT}}>
                                <TableCell></TableCell>
                                <TableCell>{t('Audit Date and hour')}</TableCell>
                                <TableCell>{t('Audit User')}</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <TableRow style={{height:ROW_HEIGHT}}>
                                <TableCell component="th" scope="row" colSpan={3} style={{textAlign:'center'}}>
                                    {t('Audit ORACLE Database users')}
                                </TableCell>
                            </TableRow>

                                    <TableRow key={1} style={{height:ROW_HEIGHT}}>
                                        <TableCell component="th" scope="row">
                                            {t('Audit Creation')}
                                        </TableCell>
                                        <TableCell >{props.oraCreationDate ? moment(props.oraCreationDate).format('DD.MM.YYYY hh:mm:ss') :''}</TableCell>
                                        <TableCell >{props.oraCreationUser }</TableCell>
                                    </TableRow>

                                    <TableRow key={2} style={{height:ROW_HEIGHT}}>
                                        <TableCell component="th" scope="row">
                                            {t('Audit Last Update')}
                                        </TableCell>
                                        <TableCell >{props.oraLastUpdateDate ? moment(props.oraLastUpdateDate).format('DD.MM.YYYY hh:mm:ss'):''}</TableCell>
                                        <TableCell >{props.oraLastUpdateUser}</TableCell>
                                    </TableRow>

                            <TableRow style={{height:ROW_HEIGHT}}>
                                <TableCell component="th" scope="row" colSpan={3} style={{textAlign:'center'}}>
                                    {t('Audit Web application users')}
                                </TableCell>
                            </TableRow>
                            <TableRow key={3} style={{height:ROW_HEIGHT}}>
                                <TableCell component="th" scope="row">
                                    {t('Audit Creation')}
                                </TableCell>
                                <TableCell >{props.appCreationDate ? moment(props.appCreationDate).format('DD.MM.YYYY hh:mm:ss'):''}</TableCell>
                                <TableCell >{props.appCreationUser ? <NavLink to={'/users/'+props.appCreationUserId} >{props.appCreationUser}</NavLink> : ''}</TableCell>
                            </TableRow>

                            <TableRow key={4} style={{height:ROW_HEIGHT}}>
                                <TableCell component="th" scope="row">
                                    {t('Audit Last Update')}
                                </TableCell>
                                <TableCell >{props.appLastUpdateDate  ? moment(props.appLastUpdateDate).format('DD.MM.YYYY hh:mm:ss'):''}</TableCell>
                                <TableCell >{props.appLastUpdateUser ? <NavLink to={'/users/'+props.appLastUpdateUser} >{props.appLastUpdateUser}</NavLink> : ''}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>

    );
};


Audit.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(translate('translations')(Audit));
