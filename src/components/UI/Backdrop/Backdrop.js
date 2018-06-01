import React from 'react';
import './Backdrop.css';

const backdrop = props => {
  if (props.show) {
    return <div className="Backdrop" onClick={props.hideBackdrop} />;
  }
  return null;
};

export default backdrop;
