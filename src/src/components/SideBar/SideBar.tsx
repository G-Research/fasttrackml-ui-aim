import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

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
  const history = useHistory();

  useEffect(() => {
    fetch(`${getBaseHost()}/version`).then((response) => {
      response.text().then((version) => {
        setVersion(version);
      });
    });
  }, []);

  const handleChange = (event: { target: { value: any } }) => {
    const selectedNamespace = event.target.value;
    console.log('selectedNamespace', selectedNamespace);
    
    // Get the current URL
    const currentUrl = window.location.pathname;
    
    // Replace 'ns2' with the selected namespace
    const newUrl = currentUrl.replace('ns2', selectedNamespace);
    
    history.push(newUrl);
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
            <Tooltip title='Switch UI' placement='right'>
              <Select
                className='Sidebar__bottom__anchor'
                onChange={handleChange}
                inputProps={{ IconComponent: () => null }}
              >
                <MenuItem value={'ns1'}>Option 1</MenuItem>
                <MenuItem value={'ns2'}>Option 2</MenuItem>
                <MenuItem value={'ns3'}>Option 3</MenuItem>
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
