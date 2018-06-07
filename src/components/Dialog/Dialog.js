import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { translate, Trans } from 'react-i18next';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DialogSlide extends React.Component {


    render() {
        const { t } = this.props;
        return (
                <Dialog
                    open
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {t('Dialog Title confirmation')}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {t('Dialog Body confirmation')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            {t('Dialog Cancel button')}
                        </Button>
                        <Button onClick={this.props.handleDelete} color="primary">
                            {t('Dialog Confirm button')}
                        </Button>
                    </DialogActions>
                </Dialog>
        );
    }
}

export default  translate('translations')(DialogSlide);