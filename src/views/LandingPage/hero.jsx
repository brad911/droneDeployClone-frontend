import { useEffect, useState } from 'react';
import heroVideo from '../../assets/videos/hero.mp4';

const Hero = () => {
  const [scrollStyle, setScrollStyle] = useState({
    opacity: 1,
    transform: 'scale(1)',
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;

      const opacity = Math.max(1 - scrollY / maxScroll, 0);
      const scale = Math.max(1 - scrollY / (maxScroll * 2), 0.85); // scales down to 85%

      setScrollStyle({
        opacity,
        transform: `scale(${scale})`,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero">
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 0,
        }}
      />
      <div className="hero__overlay">
        <div className="hero__left" style={{ ...scrollStyle }}>
          <h1 className="hero__title">
            Every corner of your site always in sight
          </h1>
          <h2 className="hero__running">
            See Everything. Control What Matters.
          </h2>
          <p className="hero__description">
            InfraX transforms how you manage your sites—combining real-time
            progress tracking, quality control, and safety oversight in one
            place.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
