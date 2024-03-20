import React from 'react';

import { Switcher, Text } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import './LiveUpdateSettings.scss';

export interface ILiveUpdateSettingsProp {
  delay: number;
  enabled: boolean;
  onLiveUpdateConfigChange: ({ enabled }: { enabled: boolean }) => void;
}

function LiveUpdateSettings(
  props: ILiveUpdateSettingsProp,
): React.FunctionComponentElement<React.ReactNode> | null {
  //@ts-ignore
  if (window.live_updates_enabled == 1) {
    return (
      <ErrorBoundary>
        <div className='LiveUpdateSettings'>
          <Text className='LiveUpdateSettings__Text' size={14}>
            Live Update:
          </Text>
          <Switcher
            checked={Boolean(props.enabled)}
            onChange={() => {
              props.onLiveUpdateConfigChange({ enabled: !props.enabled });
            }}
            size='small'
            color='primary'
          />
        </div>
      </ErrorBoundary>
    );
  }
  props.onLiveUpdateConfigChange({ enabled: false });
  return null;
}

export default React.memo<ILiveUpdateSettingsProp>(LiveUpdateSettings);
