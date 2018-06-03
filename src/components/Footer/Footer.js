import React from 'react';
import './Footer.css';

const Footer = props => {
  return (
    <footer className="FooterDistributed">
      <div className="FooterLeft">
        <h3>
          Company<span>logo</span>
        </h3>

        <p className="FooterLinks">
          <a href="#">Home</a>
          ·
          <a href="#">Blog</a>
          ·
          <a href="#">Pricing</a>
          ·
          <a href="#">About</a>
          ·
          <a href="#">Faq</a>
          ·
          <a href="#">Contact</a>
        </p>

        <p className="FooterCompanyNam">Company Name &copy; 2015</p>
      </div>

      <div className="FooterCenter">
        <div>
          <i className="fa fa-map-marker" />
          <p>
            <span>21 Revolution Street</span> Paris, France
          </p>
        </div>

        <div>
          <i className="fa fa-phone" />
          <p>+1 555 123456</p>
        </div>

        <div>
          <i className="fa fa-envelope" />
          <p>
            <a href="mailto:support@company.com">support@company.com</a>
          </p>
        </div>
      </div>

      <div className="FooterRight">
        <p className="FooterCompanyAbout">
          <span>About the company</span>
          Lorem ipsum dolor sit amet, consectateur adispicing elit. Fusce
          euismod convallis velit, eu auctor lacus vehicula sit amet.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
