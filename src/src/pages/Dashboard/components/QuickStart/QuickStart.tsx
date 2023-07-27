import * as React from 'react';

import { Link } from '@material-ui/core';

import { Text } from 'components/kit';
import CodeBlock from 'components/CodeBlock/CodeBlock';

import { DOCUMENTATIONS } from 'config/references';

import './QuickStart.scss';

function QuickStart() {
  // Get fasttrack server hostname from current browser location
  const { hostname, port, protocol } = window.location;
  const fasttrack_server = `${protocol}//${hostname}:${port}`;
  return (
    <div className='QuickStart'>
      <Text
        tint={100}
        weight={600}
        size={18}
        className='Dashboard__middle__title'
      >
        Quick Start
      </Text>
      <div className='QuickStart__section'>
        <Text
          component='h3'
          size={14}
          weight={700}
          tint={100}
          className='QuickStart__section__title'
        >
          Integrate FastTrackML with your code
        </Text>
        <CodeBlock
          code={`import mlflow

# Set FastTrackML tracking server
mlflow.set_tracking_uri("${fasttrack_server}")

# Log parameters
mlflow.log_params({
    "learning_rate": 0.001,
    "batch_size": 32,
})

# Log metrics
for i in range(10):
    mlflow.log_metric(key="loss", value=i, step=i)
    mlflow.log_metric(key="acc", value=i, step=i)`}
        />
        <Text
          component='p'
          size={14}
          weight={500}
          tint={100}
          className='QuickStart__section__text'
        >
          See the full list of supported trackable objects(e.g. images, text,
          etc){' '}
          <Link
            target='_blank'
            href={DOCUMENTATIONS.SUPPORTED_TYPES}
            rel='noreferrer'
            className='QuickStart__section__text__link'
          >
            here
          </Link>
          .
        </Text>
      </div>
    </div>
  );
}

export default QuickStart;
