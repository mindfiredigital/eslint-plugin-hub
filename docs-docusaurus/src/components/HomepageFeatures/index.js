import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Configure',
    Svg: require('@site/static/img/gears-setup.svg').default,
    description: (
      <>
        ESLint Plugin Hub is designed to be simple and intuitive, allowing you
        to configure it effortlessly for general JavaScript, TypeScript, React,
        and Angular projects.
      </>
    ),
  },
  {
    title: 'Multi-Framework Support',
    Svg: require('@site/static/img/programming.svg').default,
    description: (
      <>
        Whether you're working on a React or Angular project, the ESLint Plugin
        Hub provides a set of specific rules to ensure best practices across
        different frameworks.
      </>
    ),
  },
  {
    title: 'Highly Customizable',
    Svg: require('@site/static/img/customize.svg').default,
    description: (
      <>
        Extend or customize your ESLint configuration with ease. ESLint Plugin
        Hub allows flexible rule customization to suit the needs of your
        project.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
