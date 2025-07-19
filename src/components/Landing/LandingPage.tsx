import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from '../UI/Typewriter';

const LandingPage: React.FC = () => {
  const [headlines, setHeadlines] = useState<string[]>([
    'Global Commerce Command Center',
    'Trade Intelligence Platform',
    'Freight & Tariff Solutions',
    'AI-Powered Marketing Hub'
  ]);
  const [typewriterSpeed, setTypewriterSpeed] = useState(100);

  // Load admin-configured settings
  useEffect(() => {
    const loadAdminSettings = async () => {
      try {
        // This would typically fetch from your admin settings API
        const adminSettings = localStorage.getItem('landingPageSettings');
        if (adminSettings) {
          const settings = JSON.parse(adminSettings);
          if (settings.headlines && settings.headlines.length > 0) {
            setHeadlines(settings.headlines);
          }
        }

        const commerceSettings = localStorage.getItem('globalCommerceSettings');
        if (commerceSettings) {
          const settings = JSON.parse(commerceSettings);
          if (settings.landing_visuals?.typewriter_speed) {
            setTypewriterSpeed(settings.landing_visuals.typewriter_speed);
          }
        }
      } catch (error) {
        console.log('Using default typewriter settings');
      }
    };

    loadAdminSettings();
  }, []);

  return (
    <div className="landing-page">
      <div className="container">
        <h1 className="heading">
          The{' '}
          <Typewriter
            words={headlines}
            speed={typewriterSpeed}
            deleteSpeed={typewriterSpeed / 2}
            delayBetweenWords={3000}
            loop={true}
            startDelay={1000}
            cursorChar="|"
            cursorClassName="animate-pulse text-blue-600"
          />
        </h1>
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
