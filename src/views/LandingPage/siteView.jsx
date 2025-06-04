import { useState, useEffect, useRef } from 'react';
import heroVideo from '../../assets/videos/hero.mp4';

const tabItems = [
  'Pre-Construction',
  'Earthworks',
  'Underground utilities',
  'Exterior',
  'Interior',
  'CloseOut',
];

export default function SimpleTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);

  // Play next tab when video ends
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleEnded = () => {
      setActiveIndex((prev) => (prev + 1) % tabItems.length);
    };

    videoEl.addEventListener('ended', handleEnded);
    return () => videoEl.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <div className="simple-tabs-container">
      {/* Headings */}
      <div className="headings">
        <h4 className="small-heading">
          Don’t just trust that work is going to plan
        </h4>
        <h1 className="big-heading">
          Get an unbiased view of all your sites at any phase
        </h1>
      </div>

      {/* Main content */}
      <div className="content-wrapper">
        <div className="tabs-left">
          {tabItems.map((item, index) => (
            <div
              key={index}
              className={`tab-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="tabs-right">
          <video
            ref={videoRef}
            key={activeIndex}
            src={heroVideo} // You can map different videos per tab here later
            autoPlay
            muted
            loop={false}
            controls={false}
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
