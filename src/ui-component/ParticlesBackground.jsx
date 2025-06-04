// components/ParticlesBackground.jsx
import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

const ParticlesBackground = () => {
  console.log('ParticlesBackground component rendered');
  const particlesInit = useCallback(async (engine) => {
    console.log('particlesInit called'); // ✅ This should log now
    await loadSlim(engine); // Load everything (recommended)
  }, []);
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: '#000000', // Deep black background
          },
        },
        fullScreen: {
          enable: false,
        },
        particles: {
          number: {
            value: 120,
            density: {
              enable: true,
              area: 1000,
            },
          },
          color: {
            value: '#66ccff', // Neon light blue
          },
          links: {
            enable: true,
            color: '#66ccff',
            distance: 130,
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.8,
            direction: 'none',
            outModes: {
              default: 'bounce',
            },
            trail: {
              enable: true,
              length: 5,
              fillColor: '#000000',
            },
          },
          shape: {
            type: 'square',
          },
          opacity: {
            value: 0.7,
          },
          size: {
            value: { min: 1.5, max: 3.5 },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 1,
              sync: false,
            },
          },
        },
        interactivity: {
          events: {
            // onHover: {
            //   enable: true,
            //   mode: 'repulse', // Pulls away from mouse
            // },
            onClick: {
              enable: true,
              mode: 'push', // Add more particles
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
            push: {
              quantity: 4,
            },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;
