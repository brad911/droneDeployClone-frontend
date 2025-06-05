import { IconCircleArrowRightFilled } from '@tabler/icons-react';
import img1 from '../../assets/images/landing_page_industry_capture/1.jpg';
import img2 from '../../assets/images/landing_page_industry_capture/2.jpg';
import img3 from '../../assets/images/landing_page_industry_capture/3.jpg';
import img4 from '../../assets/images/landing_page_industry_capture/4.jpg';

const boxes = [
  {
    id: 1,
    text: 'Construction',
    image: img1,
  },
  {
    id: 2,
    text: 'Owners',
    image: img2,
  },
  {
    id: 3,
    text: 'Oil & Gas',
    image: img3,
  },
  {
    id: 4,
    text: 'Agriculture',
    image: img4,
  },
];

const FeatureBoxes = () => {
  return (
    <div className="feature-section">
      <div className="content">
        <h2 className="section-heading">
          <span className="section-heading-span"> Don’t get left behind.</span>
          See how your industry is capturing.
        </h2>
        <div className="boxes">
          {boxes.map(({ id, text, image }) => (
            <div
              key={id}
              className="box"
              style={{ backgroundImage: `url(${image})` }}
            >
              <span className="box-text">{text}</span>
              <IconCircleArrowRightFilled className="arrow-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureBoxes;
