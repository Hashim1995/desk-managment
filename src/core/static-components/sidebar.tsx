import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { TiHomeOutline } from 'react-icons/ti';
import AppHandledButton from '@/components/display/button/handle-button';
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { BiFile } from 'react-icons/bi';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  permissionkey?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    permissionkey
  } as MenuItem;
}

function Sidebar() {
  const darkMode = useReadLocalStorage('darkTheme');
  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useLocalStorage('menuCollapse', false);
  const location = useLocation();

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location, collapsed]);

  const items: MenuItem[] = [
    getItem(
      <Link to="/home"> {t('home')} </Link>,
      '/home',
      <TiHomeOutline size={18} />,
      undefined,
      'show'
    ),
    getItem(
      <Link to="/rooms"> {t('rooms')} </Link>,
      '/rooms',
      <BiFile size={18} />,
      undefined,
      'show'
    )
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        backgroundColor: !darkMode ? '#fff' : '#141414'
      }}
    >
      <div className="flex flex-col justify-between py-2 h-full">
        <div>
          <div
            style={{
              width: '100%',
              height: 70,
              padding: 15,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: darkMode ? '#141414' : '#fff'
            }}
          >
            {collapsed ? (
              <Link to="/home">logo</Link>
            ) : (
              <Link to="/home">logo</Link>
            )}
            <AppHandledButton
              icon={
                collapsed ? (
                  <FaRegArrowAltCircleRight size={20} />
                ) : (
                  <FaRegArrowAltCircleLeft size={20} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                border: 'none',
                position: 'absolute',
                top: 20,
                zIndex: 999,
                left: collapsed ? 60 : 180,
                fontSize: '16px',
                width: 40,
                height: 40,
                borderRadius: '50%',
                color: '#006FEE',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0 5px 15px'
              }}
              className="center"
            />
          </div>

          <Menu
            defaultSelectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={keys => {
              setOpenKeys(keys);
            }}
            selectedKeys={[selectedItem]}
            onSelect={({ key }) => {
              setSelectedItem(key);
            }}
            mode="inline"
            items={items}
          />
        </div>
      </div>
    </Sider>
  );
}

export default Sidebar;
