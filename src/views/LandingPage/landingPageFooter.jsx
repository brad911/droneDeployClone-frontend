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
import { countryList } from '../utilities/countries';

const handleScrollToSection = (id) => {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
};
export default function LandingPageFooter() {
  const { enqueueSnackbar } = useSnackbar();
  const contactSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string(),
    company: Yup.string(),
    country: Yup.string().required('Country is required'),
    message: Yup.string().required('Message is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      country: '',
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
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.firstName && formik.errors.firstName && (
              <small className="form-error">{formik.errors.firstName}</small>
            )}
            {formik.touched.lastName && formik.errors.lastName && (
              <small className="form-error">{formik.errors.lastName}</small>
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

            <select
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value={''}>Select Country</option>
              {countryList.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
            {formik.touched.country && formik.errors.country && (
              <small className="form-error">{formik.errors.country}</small>
            )}

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
        </div>
        <div className="footer__column">
          <h4 onClick={() => handleScrollToSection('.feature-section')}>
            Industries
          </h4>
          <a onClick={() => handleScrollToSection('.feature-section')}>
            Construction & infrastucture
          </a>
          <a onClick={() => handleScrollToSection('.feature-section')}>
            Energy, Utilities & Industrial
          </a>
          <a onClick={() => handleScrollToSection('.feature-section')}>
            Heritage & construction
          </a>
          <a onClick={() => handleScrollToSection('.feature-section')}>
            Agriculture & forest
          </a>
          <a onClick={() => handleScrollToSection('.feature-section')}>
            Surveying & Land Developement
          </a>
        </div>
        <div className="footer__column">
          <h4 onClick={() => handleScrollToSection('.simple-tabs-container')}>
            Solutions
          </h4>
          <a onClick={() => handleScrollToSection('.simple-tabs-container')}>
            Orthomosaic Viewer
          </a>
          <a onClick={() => handleScrollToSection('.simple-tabs-container')}>
            Comparision Slider
          </a>
          <a onClick={() => handleScrollToSection('.simple-tabs-container')}>
            Automated Customized Reporting
          </a>
          <a onClick={() => handleScrollToSection('.simple-tabs-container')}>
            Issue Tagging & Coordination
          </a>
          <a onClick={() => handleScrollToSection('.simple-tabs-container')}>
            360 Virtual Tour
          </a>
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
