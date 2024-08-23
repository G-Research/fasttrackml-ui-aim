import React from 'react';

import { Text } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import MenuItem from './MenuItem';
import { IMenuProps, IMenuItem } from './types';

import './Menu.scss';

/**
 * Menu component
 * usage
 *  <Menu data={[{id: 'test', name: 'test'}]} />
 */
function Menu({
  data,
  title,
  onChangeActiveItem,
  defaultActiveItemKey = '',
}: IMenuProps): React.FunctionComponentElement<React.ReactNode> {
  const [activeItemKey, setActiveItemKey] =
    React.useState<string>(defaultActiveItemKey);

  const onClickItem = React.useCallback(
    (key: string, name: string) => {
      setActiveItemKey(key);
      if (onChangeActiveItem) {
        onChangeActiveItem(key, name);
      }
    },
    [onChangeActiveItem, setActiveItemKey],
  );

  React.useEffect(() => {
    if (defaultActiveItemKey !== activeItemKey) {
      setActiveItemKey(defaultActiveItemKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultActiveItemKey]);

  return (
    <ErrorBoundary>
      <div className='Aim_Menu_Wr'>
        {title && (
          <div className='Title'>
            <Text size={14} tint={100} weight={700} component='h3'>
              {title}
            </Text>
          </div>
        )}
        <div className='Menu'>
          {data.map((item: IMenuItem) => (
            <MenuItem
              {...item}
              key={item.id}
              onClickOpen={onClickItem}
              activeItemKey={activeItemKey}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

Menu.displayName = 'Menu';

export default React.memo<IMenuProps>(Menu);
