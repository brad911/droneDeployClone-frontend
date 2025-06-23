import {
  IconBrandYoutubeFilled,
  IconBrandInstagramFilled,
  IconBrandFacebook,
  IconBrandXFilled,
  IconBrandLinkedinFilled,
} from '@tabler/icons-react';
import ParticlesBackground from '../../ui-component/ParticlesBackground';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import Logo from '../../ui-component/Logo';
import axios from '../../utils/axios.config';

const handleScrollToSection = (id) => {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
};
export default function LandingPageFooter() {
  const { enqueueSnackbar } = useSnackbar();
  const contactSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string(),
    company: Yup.string(),
    designation: Yup.string(),
    message: Yup.string().required('Message is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      designation: '',
      message: '',
    },
    validationSchema: contactSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post('/user/contact', values);
        if (res.status === 200) {
          enqueueSnackbar('Message sent successfully!', { variant: 'success' });
          resetForm();
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          enqueueSnackbar(error?.response?.data?.message, { variant: 'error' });
        } else {
          enqueueSnackbar('Failed to send message. Please try again later.', {
            variant: 'error',
          });
          console.log(error);
        }
      }
    },
  });
  return (
    <footer className="footer">
      <ParticlesBackground />

      <div className="footer__main">
        <div className="logo">
          <Logo />
        </div>
        <div className="footer__column">
          <form className="contact-form" onSubmit={formik.handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <small className="form-error">{formik.errors.name}</small>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <small className="form-error">{formik.errors.email}</small>
            )}

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formik.values.company}
              onChange={formik.handleChange}
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formik.values.designation}
              onChange={formik.handleChange}
            />

            <textarea
              name="message"
              placeholder="Message"
              rows="3"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.message && formik.errors.message && (
              <small className="form-error">{formik.errors.message}</small>
            )}

            <button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Sending...' : 'Send'}
            </button>
            {status === 'success' && (
              <div className="form-success">Message sent successfully!</div>
            )}
            {status === 'error' && (
              <div className="form-error">Failed to send. Try again.</div>
            )}
          </form>
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
