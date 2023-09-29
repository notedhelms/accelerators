import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Codeless Rule Authoring',
    Svg: require('@site/static/img/Codeless_Rule_Authoring.svg').default,
    description: (
      <>
        Domain experts author, and orchestrate rules, fully abstracted from applications. Automatically analyze rules for conflicts and missing conditions, then leverage integrated testing enables rapid identification of misbehavior.
      </>
    ),
  },
  {
    title: 'Unified Data Connectivity',
    Svg: require('@site/static/img/DataAsset 9.svg').default,
    description: (
      <>
        Stateless and interoperable: All decision data, One data model. With Progress DataDirect data connectivity drivers, included out of the box, connect to REST and RDBMS data sources at runtime.
      </>
    ),
  },
  {
    title: 'Deployment Flexibility',
    Svg: require('@site/static/img/Flowmon-Cloud - Hybrid Infrastructure-470px.svg').default,
    description: (
      <>
        Run decision services on a Server in cloud or on-prem; exposed as a web service or running inside an application. Or, run decision services as Serverless functions on any cloud platform or in offline clients for instant response time. 
        </>
    ),
  },
];
function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
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
