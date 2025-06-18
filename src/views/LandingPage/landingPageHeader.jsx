import { useEffect, useState } from 'react';
import Logo from '../../ui-component/Logo';
import { useNavigate } from 'react-router';

const LandingPageHeader = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setHideHeader(currentScrollY > lastScrollY && currentScrollY > 50);
    setLastScrollY(currentScrollY);
  };
  const handleScrollToSection = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`transparent-header ${hideHeader ? 'hide' : ''}`}>
      <div className="ribbon">
        <div className="marquee">
          <div className="marquee__inner">
            <span>🚀 Welcome to our platform — Explore what's new!</span>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="header-main-left">
          <div className="header-main-left-logo">
            <Logo />
          </div>
          <div className="header-main-left-tabs">
            <button
              onClick={() => handleScrollToSection('.hero')}
              className="button-tabs"
            >
              Platform
            </button>
            <button
              onClick={() => handleScrollToSection('.company-group')}
              className="button-tabs"
            >
              Industries
            </button>
            <button
              onClick={() => handleScrollToSection('.simple-tabs-container')}
              className="button-tabs"
            >
              Solutions
            </button>
            <button
              onClick={() => handleScrollToSection('.footer')}
              className="button-tabs"
            >
              Contact Us
            </button>
          </div>
        </div>
        <div className="header-main-right">
          <button onClick={() => navigate('/register')} className="login-btn">
            Get Started
          </button>
          <button onClick={() => navigate('/login')} className="login-btn">
            Log In
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingPageHeader;
