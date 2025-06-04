import heroVideo from '../../assets/videos/hero.mp4';
import ParticlesBackground from '../../ui-component/ParticlesBackground';

const Hero = () => {
  return (
    <>
      <section className="hero">
        <ParticlesBackground />
        <div className="hero__overlay">
          <div className="hero__left">
            <h1 className="hero__title">Leave no site unseen </h1>
            <h2 className="hero__running">
              Capture what matters, before you can’t.
            </h2>
            <p className="hero__description">
              DroneDeploy delivers robotic capture and real AI for a complete
              understanding of quality, safety and progress across all your
              sites.
            </p>
            <div className="hero__buttons">
              <button className="hero__btn">Get Started</button>
              <button className="hero__btn hero__btn--secondary">
                Learn More
              </button>
            </div>
          </div>
          <div className="hero__right">
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
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
