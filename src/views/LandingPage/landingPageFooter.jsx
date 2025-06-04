import {
  IconBrandLinkedinFilled,
  IconBrandYoutubeFilled,
  IconBrandTwitterFilled,
  IconBrandInstagramFilled,
  IconBrandFacebook,
} from '@tabler/icons-react';
import Logo from '../../ui-component/Logo';

export default function LandingPageFooter() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__column logo">
          <Logo />
        </div>
        <div className="footer__column">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Press</a>
        </div>
        <div className="footer__column">
          <h4>Solutions</h4>
          <a href="#">Construction</a>
          <a href="#">Energy</a>
          <a href="#">Surveying</a>
          <a href="#">Agriculture</a>
        </div>
        <div className="footer__column">
          <h4>Resources</h4>
          <a href="#">Help Center</a>
          <a href="#">Documentation</a>
          <a href="#">Community</a>
          <a href="#">Support</a>
        </div>
      </div>

      <div className="footer__socials">
        <div className="icons">
          <a href="#">
            <IconBrandLinkedinFilled />
          </a>
          <a href="#">
            <IconBrandYoutubeFilled />
          </a>
          <a href="#">
            <IconBrandTwitterFilled />
          </a>
          <a href="#">
            <IconBrandInstagramFilled />
          </a>
          <a href="#">
            <IconBrandFacebook />
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2025 Infra-X. All rights reserved.</p>
        <div className="footer__legal">
          <a href="#">CA Resident Privacy Notice</a>
          <a href="#">Do Not Sell My Personal Information</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
