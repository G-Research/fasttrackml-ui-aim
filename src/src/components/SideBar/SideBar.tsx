import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Drawer, Tooltip } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import logoImg from 'assets/logo.svg';

import { Icon, Text } from 'components/kit';
import { IconName } from 'components/kit/Icon';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { PathEnum } from 'config/enums/routesEnum';
import { getBaseHost, getPrefix } from 'config/config';
import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';
import { DOCUMENTATIONS } from 'config/references';

import routes, { IRoute } from 'routes/routes';

import { trackEvent } from 'services/analytics';

import { getItem } from 'utils/storage';

import './Sidebar.scss';

function SideBar(): React.FunctionComponentElement<React.ReactNode> {
  const [version, setVersion] = React.useState('unknown');
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');

  useEffect(() => {
    fetch(`${getBaseHost()}/version`).then((response) => {
      response.text().then((version) => {
        setVersion(version);
      });
    });
  }, []);

  useEffect(() => {
    fetch(`${getBaseHost()}/admin/namespaces/list`)
      .then((response) => response.json())
      .then((data) =>
        setNamespaces(data.map((item: { code: any }) => item.code)),
      );

    fetch(`${getBaseHost()}${getPrefix()}admin/namespaces/current`)
      .then((response) => response.json())
      .then((data) => {
        const selected = data.code;
        setSelectedNamespace(selected);
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedNamespace = event.target.value as string;
    let newUrl = `${getBaseHost()}/ns/${selectedNamespace}${
      routes.DASHBOARD.path
    }aim/`;
    if (selectedNamespace === 'default') {
      newUrl = `${getBaseHost()}${routes.DASHBOARD.path}aim/`;
    }
    window.location.href = newUrl;
  };

  function getPathFromStorage(route: PathEnum): PathEnum | string {
    const path = getItem(`${route.slice(1)}Url`) ?? '';
    if (path !== '' && path.startsWith(route)) {
      return path;
    }
    return route;
  }

  return (
    <ErrorBoundary>
      <div className='Sidebar'>
        <Drawer
          PaperProps={{ className: 'Sidebar__Paper' }}
          variant='permanent'
          anchor='left'
        >
          <ul className='Sidebar__List'>
            <NavLink
              exact={true}
              className='Sidebar__NavLink'
              to={routes.DASHBOARD.path}
            >
              <li className='Sidebar__List__item'>
                <img src={logoImg} alt='logo' />
              </li>
            </NavLink>
            <div className='Sidebar__List__container ScrollBar__hidden'>
              {Object.values(routes).map((route: IRoute, index: number) => {
                const { showInSidebar, path, displayName, icon } = route;
                return (
                  showInSidebar && (
                    <NavLink
                      key={index}
                      to={() => getPathFromStorage(path)}
                      exact={true}
                      isActive={(m: any, location: { pathname: string }) =>
                        location.pathname.split('/')[1] === path.split('/')[1]
                      }
                      activeClassName='Sidebar__NavLink--active'
                      className='Sidebar__NavLink'
                    >
                      <li className='Sidebar__List__item'>
                        <Icon
                          className='Sidebar__List__item--icon'
                          fontSize={24}
                          name={icon as IconName}
                        />
                        <span className='Sidebar__List__item--text'>
                          {displayName}
                        </span>
                      </li>
                    </NavLink>
                  )
                );
              })}
            </div>
          </ul>
          <div className='Sidebar__bottom'>
            <Tooltip title='Namespaces' placement='right'>
              <Select
                className='Sidebar__bottom__anchor'
                value={selectedNamespace}
                onChange={handleChange}
                style={{ fontSize: '0.875rem', textAlign: 'right' }}
              >
                {namespaces.map((namespace) => (
                  <MenuItem value={namespace} key={namespace}>
                    {namespace}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
            <Tooltip title='Switch UI' placement='right'>
              <a href={getPrefix()} className='Sidebar__bottom__anchor'>
                <Icon name='live-demo' />
              </a>
            </Tooltip>
            <Tooltip title='Docs' placement='right'>
              <a
                target='_blank'
                href={DOCUMENTATIONS.MAIN_PAGE}
                rel='noreferrer'
                className='Sidebar__bottom__anchor'
                onClick={() => trackEvent(ANALYTICS_EVENT_KEYS.sidebar.docs)}
              >
                <Icon name='full-docs' />
              </a>
            </Tooltip>
            <Text tint={30}>{version}</Text>
          </div>
        </Drawer>
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(SideBar);
