import React from 'react';
import classes from './Backdrop.css';

const backdrop = props => {
    if (props.show) {
       return <div className={classes.Backdrop} onClick={props.hideBackdrop}/>
    }
    return null;
}


export default backdrop;
