import { useEffect, useState } from 'react';
import Logo from '../../ui-component/Logo';
import { useNavigate } from 'react-router';

const LandingPageHeader = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setHideHeader(true); // scrolling down
    } else {
      setHideHeader(false); // scrolling up
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`transparent-header ${hideHeader ? 'hide' : ''}`}>
      <Logo />
      <button onClick={() => navigate('/login')} className="login-btn">
        Log In
      </button>
    </header>
  );
};

export default LandingPageHeader;
