import React from 'react';

import { MenuItem, Tooltip } from '@material-ui/core';

import { Button, Icon, Text } from 'components/kit';
import ControlPopover from 'components/ControlPopover/ControlPopover';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { UnselectedColumnState } from 'config/table/tableConfigs';

import { AppNameEnum } from 'services/models/explorer';

import './HideColumnsPopover.scss';

function HideColumnsPopover({
  unselectedColumnState,
  onDefaultColumnsVisibilityChange,
  appName,
}: {
  unselectedColumnState: UnselectedColumnState;
  onDefaultColumnsVisibilityChange: (value: UnselectedColumnState) => void;
  appName: AppNameEnum;
}) {
  const columnStateChanged: boolean = React.useMemo(() => {
    return unselectedColumnState !== UnselectedColumnState.DEFAULT;
  }, [unselectedColumnState]);

  const [unselectedColumnLocal, setUnselectedColumnLocal] =
    React.useState<UnselectedColumnState>(unselectedColumnState);

  // Triggers re-rendering on unselectedColumnState change
  React.useEffect(() => {
    setUnselectedColumnLocal(unselectedColumnState);
  }, [unselectedColumnState]);

  function handleDefaultColumnsVisibilityChange(
    value: UnselectedColumnState,
  ): void {
    onDefaultColumnsVisibilityChange(value);
    setUnselectedColumnLocal(value);
  }

  return (
    <ErrorBoundary>
      <ControlPopover
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchor={({ onAnchorClick, opened }) => (
          <Tooltip
            title='Toggle hiding unselected columns by default'
            placement='top'
          >
            <div>
              <Button
                variant='text'
                color='secondary'
                size='small'
                onClick={onAnchorClick}
                className={`HideColumnsPopover__trigger ${
                  opened || columnStateChanged ? 'opened' : ''
                }`}
              >
                <Icon name='eye-outline-hide' />
                <Text size={14} tint={100}>
                  Hide Columns by Default
                </Text>
              </Button>
            </div>
          </Tooltip>
        )}
        component={
          <div className='HideColumnsPopover'>
            <Tooltip title='Hide unselected params/metrics by default'>
              <MenuItem
                className='HideColumnsPopover__item'
                selected={
                  unselectedColumnLocal === UnselectedColumnState.FORCE_HIDE
                }
                onClick={() =>
                  handleDefaultColumnsVisibilityChange(
                    UnselectedColumnState.FORCE_HIDE,
                  )
                }
              >
                Always Hide Unselected
              </MenuItem>
            </Tooltip>
            <Tooltip title='Show all params/metrics by default'>
              <MenuItem
                className='HideColumnsPopover__item'
                selected={
                  unselectedColumnLocal === UnselectedColumnState.FORCE_SHOW
                }
                onClick={() =>
                  handleDefaultColumnsVisibilityChange(
                    UnselectedColumnState.FORCE_SHOW,
                  )
                }
              >
                Always Show Unselected
              </MenuItem>
            </Tooltip>
            <Tooltip title='Manage column visibility manually'>
              <MenuItem
                className='HideColumnsPopover__item'
                selected={
                  unselectedColumnLocal === UnselectedColumnState.DEFAULT
                }
                onClick={() =>
                  handleDefaultColumnsVisibilityChange(
                    UnselectedColumnState.DEFAULT,
                  )
                }
              >
                Default
              </MenuItem>
            </Tooltip>
          </div>
        }
      />
    </ErrorBoundary>
  );
}

export default React.memo(HideColumnsPopover);
