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
      title: 'Integrate PyTorch Lightning',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.PYTORCH_LIGHTNING,
      code: `from pytorch_lightning import Trainer
from pytorch_lightning.loggers import MLFlowLogger

mlf_logger = MLFlowLogger(
    experiment_name='experiment_name',
    tracking_uri='${fasttrack_server}'
)
trainer = Trainer(logger=mlf_logger)
# ...`,
    },
    {
      title: 'Integrate Hugging Face',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.HUGGING_FACE,
      code: `from aim.hugging_face import AimCallback

# ...
aim_callback = AimCallback(repo='/path/to/logs/dir', experiment='mnli')
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset if training_args.do_train else None,
    eval_dataset=eval_dataset if training_args.do_eval else None,
    callbacks=[aim_callback],
    # ...
)
# ...`,
    },
    {
      title: 'Integrate Keras & tf.keras',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.KERAS,
      code: `import mlflow
from mlflow import set_tracking_uri
import mlflow.keras

# Set FastTrackML tracking server
set_tracking_uri("${fasttrack_server}")

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
      title: 'Integrate KerasTuner',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.KERAS_TUNER,
      code: `from aim.keras_tuner import AimCallback

# ...
tuner.search(
    train_ds,
    validation_data=test_ds,
    callbacks=[AimCallback(tuner=tuner, repo='.', experiment='keras_tuner_test')],
)
# ...`,
    },
    {
      title: 'Integrate XGBoost',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.XGBOOST,
      code: `from aim.xgboost import AimCallback

# ...
aim_callback = AimCallback(repo='/path/to/logs/dir', experiment='experiment_name')
bst = xgb.train(param, xg_train, num_round, watchlist, callbacks=[aim_callback])
# ...`,
    },
    {
      title: 'Integrate CatBoost',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.CATBOOST,
      code: `from aim.catboost import AimLogger

# ...
model.fit(train_data, train_labels, log_cout=AimLogger(loss_function='Logloss'), logging_level="Info")
# ...`,
    },
    {
      title: 'Integrate fastai',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.FASTAI,
      code: `import mlflow.fastai
import mlflow
from mlflow import set_tracking_uri

# Set FastTrackML tracking server
set_tracking_uri("${fasttrack_server}")

# Define the Learner model
model = ...

# log the fastai Leaner model
with mlflow.start_run() as run:
    model.fit(epochs, learning_rate)
    mlflow.fastai.log_model(model, "model")

# Load the model for scoring
model_uri = "runs:/{}/model".format(run.info.run_id)
loaded_model = mlflow.fastai.load_model(model_uri)
results = loaded_model.predict(predict_data)`,
    },
    {
      title: 'Integrate LightGBM',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.LIGHT_GBM,
      code: `from aim.lightgbm import AimCallback

# ...
aim_callback = AimCallback(experiment='lgb_test')
aim_callback.experiment['hparams'] = params

gbm = lgb.train(params,
                lgb_train,
                num_boost_round=20,
                valid_sets=lgb_eval,
                callbacks=[aim_callback, lgb.early_stopping(stopping_rounds=5)])
# ...`,
    },

    {
      title: 'Integrate PyTorch Ignite',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.PYTORCH_IGNITE,
      code: `from aim.pytorch_ignite import AimLogger

# ...
aim_logger = AimLogger()

aim_logger.log_params({
    "model": model.__class__.__name__,
    "pytorch_version": str(torch.__version__),
    "ignite_version": str(ignite.__version__),
})

aim_logger.attach_output_handler(
    trainer,
    event_name=Events.ITERATION_COMPLETED,
    tag="train",
    output_transform=lambda loss: {'loss': loss}
)
# ...`,
    },
  ];

  return (
    <div className='AimIntegrations'>
      <Text tint={100} weight={600} size={18}>
        Integrate Aim with your favorite ML framework
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
              <Text
                component='p'
                size={12}
                weight={600}
                tint={100}
                className='AimIntegrations__section__text'
              >
                See documentation{' '}
                <Link
                  target='_blank'
                  href={item.docsLink}
                  rel='noreferrer'
                  className='QuickStart__section__text__link'
                >
                  here
                </Link>
                .
              </Text>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default AimIntegrations;
