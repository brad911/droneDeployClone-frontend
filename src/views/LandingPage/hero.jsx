import heroVideo from '../../assets/videos/hero.mp4';

const Hero = () => {
  return (
    <>
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
          <div className="hero__left">
            <h1 className="hero__title">
              Every corner of your site always in sight
            </h1>
            <h2 className="hero__running">
              See Everything. Control What Matters.
            </h2>
            <p className="hero__description">
              InfraX transforms how you manage your sites— combining real-time
              progress tracking, quality control, and safety oversight in one
              place.
            </p>
          </div>
          {/* <div className="hero__right">
            <div className="video-wrapper">
              <video
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="hero__video"
              />
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default Hero;
