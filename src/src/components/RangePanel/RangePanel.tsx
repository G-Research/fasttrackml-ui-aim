import React from 'react';
import _ from 'lodash-es';

import SliderWithInput from 'components/SliderWithInput';
import { Button, Icon, Text } from 'components/kit';
import { IValidationMetadata } from 'components/kit/Input';

import { IRangeSliderPanelProps } from './RangePanel.d';

import './RangePanel.scss';

function RangePanel({
  onApply,
  applyButtonDisabled,
  onRangeSliderChange,
  onInputChange,
  items,
}: IRangeSliderPanelProps) {
  return (
    <form
      className='RangePanel'
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      <div className='RangePanelContainer'>
        {items?.map((item) => {
          console.log('RangePanel -> item', item);
          const rangeLength = _.range(
            item.rangeEndpoints?.[0] ?? 0,
            (item.rangeEndpoints?.[1] ?? 0) + 2,
          ).length;
          console.log('RangePanel -> rangeLength', rangeLength);
          return (
            <React.Fragment key={item.sliderName}>
              {item.rangeEndpoints?.[0] !== item.rangeEndpoints?.[1] ? (
                <SliderWithInput
                  sliderType={item?.sliderType}
                  sliderTitle={item.sliderTitle}
                  countInputTitle={item.inputTitle}
                  countTitleTooltip={item.inputTitleTooltip}
                  sliderTitleTooltip={item.sliderTitleTooltip}
                  min={item.rangeEndpoints?.[0]}
                  max={item.rangeEndpoints?.[1] + 1}
                  selectedRangeValue={item.selectedRangeValue}
                  selectedCountValue={item.inputValue}
                  onSearch={onApply}
                  onRangeChange={(value) =>
                    onRangeSliderChange(item.sliderName, value)
                  }
                  onCountChange={(value, metadata?: IValidationMetadata) => {
                    onInputChange(item.inputName, value, metadata);
                  }}
                  inputValidationPatterns={
                    item?.inputValidationPatterns ?? [
                      {
                        errorCondition: (value: string | number) => +value <= 0,
                        errorText: `Value should be greater than ${0}`,
                      },
                      {
                        errorCondition: (value: string | number) => {
                          return +value > rangeLength;
                        },
                        errorText: `Value should be smaller than ${
                          rangeLength + 1
                        }`,
                      },
                    ]
                  }
                />
              ) : (
                <div className='InfoMassageBox'>
                  <Icon name='circle-info' color={'#1473E6'} />
                  <Text size={11} tint={80} weight={500}>
                    You have only
                    <Text
                      size={11}
                      tint={80}
                      weight={600}
                      className='InfoMessageBoldText'
                    >
                      1 {item?.infoPropertyName || 'step'}
                    </Text>
                    logged.
                  </Text>
                </div>
              )}
              <div className='VerticalDivider' />
            </React.Fragment>
          );
        })}
        <div className='ApplyButtonContainer'>
          <Button
            size='small'
            color='primary'
            variant='contained'
            type='submit'
            className='ApplyButton'
            disabled={applyButtonDisabled}
          >
            Apply
          </Button>
        </div>
      </div>
    </form>
  );
}

RangePanel.displayName = 'RangePanel';

export default React.memo<IRangeSliderPanelProps>(RangePanel);
