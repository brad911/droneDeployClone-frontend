import { IconCircleArrowRightFilled } from '@tabler/icons-react';
import img1 from '../../assets/images/landing_page_industry_capture/1.jpg';
import img2 from '../../assets/images/landing_page_industry_capture/2.jpg';
import img3 from '../../assets/images/landing_page_industry_capture/3.jpg';
import img4 from '../../assets/images/landing_page_industry_capture/4.jpg';

const boxes = [
  {
    id: 1,
    text: 'Construction & Infrastructure ',
    image: img1,
  },
  {
    id: 2,
    text: 'Energy, Utilities & Industrial ',
    image: img2,
  },
  {
    id: 3,
    text: 'Heritage & Conservation',
    image: img3,
  },
  {
    id: 4,
    text: 'Agriculture & Forest',
    image: img4,
  },
  {
    id: 5,
    text: 'Surveying & land development',
    image: img4,
  },
];

const FeatureBoxes = () => {
  return (
    <div className="feature-section">
      <div className="content">
        <h2 className="section-heading">
          Explore the Industries embracing the innovation.
        </h2>
        <div className="boxes">
          {boxes.map(({ id, text, image }) => (
            <div
              key={id}
              className="box"
              style={{ backgroundImage: `url(${image})` }}
            >
              <span className="box-text">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureBoxes;
