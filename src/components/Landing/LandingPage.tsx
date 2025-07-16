import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <div className="container">
        <h1 className="heading">The Global Commerce Command Center</h1>
        <p className="subheading">One Command Center. Every Global Trade Advantage.</p>

        <div className="plugin-list">
          <div className="plugin-card blue">
            <h3>Global Trade Intelligence</h3>
          </div>
          <div className="plugin-card green">
            <h3>Freight & Tariff Tools</h3>
          </div>
          <div className="plugin-card purple">
            <h3>HS Code Lookup + FTA Matching</h3>
          </div>
          <div className="plugin-card orange">
            <h3>Shipment Tracking</h3>
          </div>
          <div className="plugin-card red">
            <h3>AI-powered Marketing + CRM</h3>
          </div>
        </div>

        <div className="cta-buttons">
          <a href="/platform-overview" className="btn btn-gradient">Explore Our Platform</a>
          <a href="/signup" className="btn btn-dark">Start Free Trial</a>
          <a href="/pricing" className="btn btn-light">View Plans</a>
        </div>

        <div className="auth-toggle">
          <div className="login-box">
            <h3>Client Login</h3>
            <form>
              <input type="email" placeholder="Email Address" />
              <input type="password" placeholder="Password" />
              <button type="submit" className="btn btn-gradient">Sign In</button>
            </form>
            <p className="demo-text">
              Demo Credentials:<br />
              Client: <code>john@techcorp.com / password</code>
            </p>
            <a href="/forgot-password" className="link">Forgot password?</a>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 B3ACON | All rights reserved.</p>
          <p><a href="/agency/login">Agency Portal Login</a></p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
