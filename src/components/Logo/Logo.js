import React from 'react';
import './Logo.css';
import logoImg from '../../assets/images/logo_cscf.png';

const logo = props => (
  <div className="Logo">
    <img alt="Burger" src={logoImg} />
  </div>
);
export default logo;
