// components/ParticlesBackground.jsx
import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
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
        fpsLimit: 120,
        particles: {
          number: {
            value: 120,
            density: {
              enable: true,
              area: 1000,
            },
          },
          color: {
            value: '#2563EB', // Neon light blue
          },
          links: {
            enable: true,
            color: '#2563EB',
            distance: 130,
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
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
            onHover: {
              enable: true,
              mode: 'repulse', // Pulls away from mouse
            },
            onClick: {
              enable: true,
              mode: 'push', // Add more particles
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 50,
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
