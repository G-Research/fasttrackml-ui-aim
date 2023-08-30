import * as React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
} from '@material-ui/core';

import { Icon, Text } from 'components/kit';
import CodeBlock from 'components/CodeBlock/CodeBlock';

import { DOCUMENTATIONS } from 'config/references';

import './AimIntegrations.scss';

function AimIntegrations() {
  const [expanded, setExpanded] = React.useState<number | boolean>(0);

  const handleChange =
    (panel: number) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  // Get fasttrack server hostname from current browser location
  const { hostname, port, protocol } = window.location;
  const fasttrack_server = `${protocol}//${hostname}:${port}`;

  const integrations = [
    {
      title: 'Integrate PyTorch',
      code: `import pytorch_lightning as pl
import mlflow.pytorch

mlflow.set_tracking_uri("${fasttrack_server}")
mlflow.pytorch.autolog()

# ....
trainer = pl.Trainer.from_argparse_args(
    args, callbacks=[], checkpoint_callback=checkpoint_callback
)
trainer.fit(model, dm)
trainer.test()
# ...`,
    },
    {
      title: 'Integrate Keras & tf.keras',
      code: `import mlflow.keras

# Set FastTrackML tracking server
mlflow.set_tracking_uri("${fasttrack_server}")

# ...

# Build, compile, enable autologging, and train your model
keras_model = ...
keras_model.compile(optimizer="rmsprop", loss="mse", metrics=["accuracy"])

# autolog your metrics, parameters, and model
mlflow.keras.autolog()
results = keras_model.fit(
    x_train, y_train, epochs=20, batch_size=128, validation_data=(x_val, y_val))
# ...`,
    },
    {
      title: 'Integrate XGBoost',
      code: `from sklearn import datasets
from sklearn.model_selection import train_test_split
import mlflow.xgboost
import xgboost as xgb

# Set FastTrackML tracking server
mlflow.set_tracking_uri("${fasttrack_server}")

# ...
# prepare train and test data
iris = datasets.load_iris()
X = iris.data
y = iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# enable auto logging
mlflow.xgboost.autolog()

dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

with mlflow.start_run():
    # train model
    params = {
        "objective": "multi:softprob",
        "num_class": 3,
        # ...
    }
    model = xgb.train(params, dtrain, evals=[(dtrain, "train")])
# ...`,
    },
    {
      title: 'Integrate fastai',
      code: `import mlflow.fastai

# Set FastTrackML tracking server
mlflow.set_tracking_uri(${fasttrack_server})

# ...

# Enable auto logging
mlflow.fastai.autolog()

# Start MLflow session
with mlflow.start_run() as run:
    model.fit(epochs, learning_rate)

# ...`,
    },
    {
      title: 'Integrate LightGBM',
      code: `import lightgbm as lgb
import mlflow.lightgbm

# Set FastTrackML tracking server
mlflow.set_tracking_uri("${fasttrack_server}")

#...

# enable auto logging
mlflow.lightgbm.autolog()

with mlflow.start_run():
        # train model
        model = lgb.train(
            params, train_set, num_boost_round=10, valid_sets=[train_set], valid_names=["train"]
        )
#...`,
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
