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
        <Logo />
        <button onClick={() => navigate('/login')} className="login-btn">
          Log In
        </button>
      </div>
    </header>
  );
};

export default LandingPageHeader;
