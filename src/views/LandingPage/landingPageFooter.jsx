import {
  IconBrandYoutubeFilled,
  IconBrandTwitterFilled,
  IconBrandInstagramFilled,
  IconBrandFacebook,
  IconBrandXFilled,
  IconBrandLinkedinFilled,
} from '@tabler/icons-react';
import ParticlesBackground from '../../ui-component/ParticlesBackground';

import Logo from '../../ui-component/Logo';

const handleScrollToSection = (id) => {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
};
export default function LandingPageFooter() {
  return (
    <footer className="footer">
      <ParticlesBackground />

      <div className="footer__main">
        <div className="footer__column logo">
          <Logo />
        </div>
        <div className="footer__column">
          <h4 onClick={() => handleScrollToSection('.hero')}>Platform</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Press</a>
        </div>
        <div className="footer__column">
          <h4 onClick={() => handleScrollToSection('.feature-section')}>
            Industry
          </h4>
          <a href="#">Construction</a>
          <a href="#">Energy</a>
          <a href="#">Surveying</a>
          <a href="#">Agriculture</a>
        </div>
        <div className="footer__column">
          <h4 onClick={() => handleScrollToSection('.simple-tabs-container')}>
            Solutions & Features
          </h4>
          <a href="#">Help Center</a>
          <a href="#">Documentation</a>
          <a href="#">Community</a>
          <a href="#">Support</a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2025 Infra-X. All rights reserved.</p>
        <div className="footer__socials">
          <div className="icons">
            <a href="#">
              <IconBrandLinkedinFilled />
            </a>
            <a href="#">
              <IconBrandYoutubeFilled />
            </a>
            <a href="#">
              <IconBrandXFilled />
            </a>
            <a href="#">
              <IconBrandInstagramFilled />
            </a>
            <a href="#">
              <IconBrandFacebook />
            </a>
          </div>
        </div>
        <div className="footer__legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
