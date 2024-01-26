import React from 'react';
import classNames from 'classnames';

import { Tooltip } from '@material-ui/core';

import ControlPopover from 'components/ControlPopover/ControlPopover';
import TooltipContentPopover from 'components/TooltipContentPopover/TooltipContentPopover';
import ParamsScalePopover from 'components/ParamsScalePopover/ParamsScalePopover';
import { Icon } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { CONTROLS_DEFAULT_CONFIG } from 'config/controls/controlsDefaultConfig';

import { IControlProps } from 'types/pages/params/components/Controls/Controls';

import { CurveEnum } from 'utils/d3';

import './Controls.scss';

function Controls(
  props: IControlProps,
): React.FunctionComponentElement<React.ReactNode> {
  const tooltipChanged: boolean = React.useMemo(() => {
    return (
      props.tooltip?.appearance !==
        CONTROLS_DEFAULT_CONFIG.params.tooltip.appearance ||
      props.tooltip?.selectedFields?.length !==
        CONTROLS_DEFAULT_CONFIG.params.tooltip.selectedFields.length
    );
  }, [props.tooltip]);

  const paramsScaleChanged: boolean = React.useMemo(() => {
    const changed = props.selectedParams.some(
      (param) =>
        param.scale !== CONTROLS_DEFAULT_CONFIG.params.defaultParamsScaleType,
    );
    return changed;
  }, [props.selectedParams]);

  return (
    <ErrorBoundary>
      <div className='Params__Controls__container'>
        <Tooltip title='Curve interpolation'>
          <div
            className={`Params__Controls__anchor ${
              props.curveInterpolation === CurveEnum.Linear
                ? ''
                : 'active outlined'
            }`}
            onClick={props.onCurveInterpolationChange}
          >
            <Icon
              name='smoothing'
              className={`Params__Controls__icon ${
                props.curveInterpolation === CurveEnum.Linear ? '' : 'active'
              } `}
            />
          </div>
        </Tooltip>
        <Tooltip title='Color indicator'>
          <div
            className={`Params__Controls__anchor ${
              props.isVisibleColorIndicator ? 'active outlined' : ''
            }`}
            onClick={props.onColorIndicatorChange}
          >
            <Icon
              name='indicator'
              className={`Params__Controls__icon ${
                props.isVisibleColorIndicator ? 'active' : ''
              } `}
            />
          </div>
        </Tooltip>
        <div>
          <ErrorBoundary>
            <ControlPopover
              title='Params scale'
              anchor={({ onAnchorClick, opened }) => (
                <Tooltip title='Params scale'>
                  <div
                    onClick={onAnchorClick}
                    className={classNames('Controls__anchor', {
                      active: opened || paramsScaleChanged,
                      outlined: !opened && paramsScaleChanged,
                    })}
                  >
                    <Icon
                      className={classNames('Controls__icon', {
                        active: opened || paramsScaleChanged,
                      })}
                      name='axes-scale'
                    />
                  </div>
                </Tooltip>
              )}
              component={
                <ParamsScalePopover
                  onParamsScaleTypeChange={props.onParamsScaleTypeChange}
                  selectedParams={props.selectedParams}
                />
              }
            />
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary>
            <ControlPopover
              title='Display in tooltip'
              anchor={({ onAnchorClick, opened }) => (
                <Tooltip title='Tooltip fields'>
                  <div
                    onClick={onAnchorClick}
                    className={`Params__Controls__anchor ${
                      opened
                        ? 'active'
                        : tooltipChanged
                        ? 'active outlined'
                        : ''
                    } `}
                  >
                    {/*TODO need to change icon */}
                    <Icon
                      className={`Params__Controls__icon ${
                        opened || tooltipChanged ? 'active' : ''
                      } `}
                      name='cursor'
                    />
                  </div>
                </Tooltip>
              )}
              component={
                <TooltipContentPopover
                  selectOptions={props.selectOptions}
                  selectedFields={props.tooltip?.selectedFields}
                  tooltipAppearance={props.tooltip?.appearance}
                  isTooltipDisplayed={props.tooltip?.display}
                  onChangeTooltip={props.onChangeTooltip}
                />
              }
            />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Controls;
