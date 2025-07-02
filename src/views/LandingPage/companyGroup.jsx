import { useState } from 'react';
// Future logos
import f1 from '../../assets/images/logos/future/1.png';
// import f2 from '../../assets/images/logos/future/1.svg';
// import f3 from '../../assets/images/logos/future/3.png';
// import f4 from '../../assets/images/logos/future/4.avif';
// import f5 from '../../assets/images/logos/future/5.avif';
// import f6 from '../../assets/images/logos/future/6.avif';
// import f7 from '../../assets/images/logos/future/7.avif';
// import f8 from '../../assets/images/logos/future/8.avif';
// import f9 from '../../assets/images/logos/future/9.avif';
// import f10 from '../../assets/images/logos/future/10.avif';

// // Innovation logos
// import i1 from '../../assets/images/logos/innovation/1.png';
// import i2 from '../../assets/images/logos/innovation/2.avif';
// import i3 from '../../assets/images/logos/innovation/3.avif';
// import i4 from '../../assets/images/logos/innovation/4.avif';
// import i5 from '../../assets/images/logos/innovation/5.avif';
// import i6 from '../../assets/images/logos/innovation/6.avif';
// import i7 from '../../assets/images/logos/innovation/7.avif';
// import i8 from '../../assets/images/logos/innovation/8.avif';
// import i9 from '../../assets/images/logos/innovation/9.avif';
// import i10 from '../../assets/images/logos/innovation/10.avif';

// // Explore logos
// import e1 from '../../assets/images/logos/explore/1.png';
// import e2 from '../../assets/images/logos/explore/2.avif';
// import e3 from '../../assets/images/logos/explore/3.avif';
// import e4 from '../../assets/images/logos/explore/4.avif';
// import e5 from '../../assets/images/logos/explore/5.avif';
// import e6 from '../../assets/images/logos/explore/6.avif';
// import e7 from '../../assets/images/logos/explore/7.avif';
// import e8 from '../../assets/images/logos/explore/8.avif';
// import e9 from '../../assets/images/logos/explore/9.avif';
// import e10 from '../../assets/images/logos/explore/10.avif';

// `src/assets/images/logos/${i + 1}.png`
const variants = [
  {
    prefix: ' Trusted by Industry Leaders.',
    word: '',
    suffix: '',
    logos: [f1, f1, f1, f1, f1],
  },
  //   {
  //     prefix: 'Trusted by the people who ',
  //     word: 'feed',
  //     suffix: ' our world',
  //     logos: [i1, i2, i3, i4, i5, i6, i7, i8, i9, i10],
  //   },
  //   {
  //     prefix: 'Trusted by the people who ',
  //     word: 'build',
  //     suffix: ' our world',
  //     logos: [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10],
  //   },
];

export const CompanyGroup = () => {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setAnimate(false); // Start animating out the word
  //     setTimeout(() => {
  //       setIndex((prev) => (prev + 1) % variants.length);
  //       setAnimate(true); // Animate in the new word
  //     }, 400);
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, []);

  const { prefix, word, suffix, logos } = variants[index];

  return (
    <div className="company-group">
      <h2 className="company-group__heading">
        {prefix}
        <span className={`highlight animated-word ${animate ? 'in' : 'out'}`}>
          {word}
        </span>
        {suffix}
      </h2>

      <div className="company-group__logos">
        {logos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Logo ${i + 1}`}
            className="company-group__logo"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyGroup;
