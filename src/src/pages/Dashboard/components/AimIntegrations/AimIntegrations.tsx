import * as React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';

import { Icon, Text } from 'components/kit';
import CodeBlock from 'components/CodeBlock/CodeBlock';

import { getTrackingURI } from 'config/config';

import './AimIntegrations.scss';

function AimIntegrations() {
  const [expanded, setExpanded] = React.useState<number | boolean>(0);

  const handleChange =
    (panel: number) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const integrations = [
    {
      title: 'Integrate PyTorch Lightning',
      code: `import pytorch_lightning as pl
import mlflow

# Set FastTrackML tracking server
mlflow.set_tracking_uri("${getTrackingURI()}")

# Enable autologging
mlflow.pytorch.autolog()

# ...
trainer = pl.Trainer()
trainer.fit(model, dm)
trainer.test()
# ...`,
    },
    {
      title: 'Integrate Keras & tf.keras',
      code: `from tensorflow import keras
import mlflow

# Set FastTrackML tracking server
mlflow.set_tracking_uri("${getTrackingURI()}")

# Enable autologging
mlflow.tensorflow.autolog()

# ...
results = keras_model.fit(
    x_train, y_train, epochs=20, batch_size=128, validation_data=(x_val, y_val))
# ...`,
    },
    {
      title: 'Integrate XGBoost',
      code: `import mlflow
import xgboost as xgb

# Set FastTrackML tracking server
mlflow.set_tracking_uri("${getTrackingURI()}")

# Enable autologging
mlflow.xgboost.autolog()

# Start MLflow session
with mlflow.start_run():
    # ...
    model = xgb.train(params, dtrain, evals=[(dtrain, "train")])
    # ...`,
    },
    {
      title: 'Integrate fastai',
      code: `from fastai.learner import Learner
import mlflow

# Set FastTrackML tracking server
mlflow.set_tracking_uri(${getTrackingURI()})

# Enable autologging
mlflow.fastai.autolog()

# ...

# Create Learner model
learn = Learner(get_data_loaders(), Model(), loss_func=nn.MSELoss(), splitter=splitter)

# Start MLflow session
with mlflow.start_run():
    # ...
    learn.fit_one_cycle(args.epochs, args.lr)
    # ...`,
    },
    {
      title: 'Integrate LightGBM',
      code: `import lightgbm as lgb
import mlflow

# Set FastTrackML tracking server
mlflow.set_tracking_uri("${getTrackingURI()}")

# Enable autologging
mlflow.lightgbm.autolog()

# ...

# Start MLflow session
with mlflow.start_run():
    # ...
    model = lgb.train(
        params, train_set, num_boost_round=10, valid_sets=[train_set], valid_names=["train"]
    )
    # ...`,
    },
  ];

  return (
    <div className='AimIntegrations'>
      <Text tint={100} weight={600} size={18}>
        Integrate FastTrackML with your favorite ML framework
      </Text>
      <div className='AimIntegrations__section'>
        {integrations.map((item, i) => (
          <Accordion
            key={item.title}
            expanded={expanded === i}
            onChange={handleChange(i)}
            className='AimIntegrations__section__accordion'
          >
            <AccordionSummary
              aria-controls='panel1d-content'
              id='panel1d-header'
              expandIcon={<Icon name='arrow-down' fontSize={12} />}
              className='AimIntegrations__section__accordion__summary'
            >
              <Text component='p' size={12} weight={600} tint={100}>
                {item.title}
              </Text>
            </AccordionSummary>
            <AccordionDetails className='AimIntegrations__section__accordion__details'>
              <CodeBlock code={item.code} />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default AimIntegrations;
