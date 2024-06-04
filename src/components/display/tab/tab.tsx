import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

/**
 * A custom tab component integrated with Ant Design's Tabs, supporting customization and event handling.
 * @typedef {import('antd').TabsProps} TabsProps
 *
 * @typedef {Object} IProps
 * @property {TabsProps['items']} items - The items to be displayed as tabs.
 * @property {() => void} [onChange] - Callback function triggered when the active tab changes.
 * @property {string} [defaultActiveKey] - The key of the tab to be initially activated.
 * @property {TabsProps} [tabProps] - Props to be passed to the Ant Design Tabs component.
 *
 * @param {IProps} props - Props for the AppHandledTab component.
 * @returns {JSX.Element} - JSX element representing the AppHandledTab component.
 *
 * @example
 * // Usage example
 * import React from 'react';
 * import AppHandledTab from './AppHandledTab';
 *
 * function ExampleComponent() {
 *   const items = [
 *     { key: '1', tab: 'Tab 1', content: 'Content of Tab 1' },
 *     { key: '2', tab: 'Tab 2', content: 'Content of Tab 2' },
 *     { key: '3', tab: 'Tab 3', content: 'Content of Tab 3' },
 *   ];
 *
 *   return (
 *     <AppHandledTab
 *       items={items}
 *       defaultActiveKey="1"
 *       onChange={() => console.log('Tab changed')}
 *       tabProps={{ tabBarStyle: { background: '#f0f2f5' } }}
 *     />
 *   );
 * }
 *
 * export default ExampleComponent;
 */

interface IProps {
  items: TabsProps['items'];
  onChange?: () => void;
  defaultActiveKey?: string;
  tabProps?: TabsProps;
}

function AppHandledTab({
  items,
  onChange,
  defaultActiveKey,
  tabProps
}: IProps) {
  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      items={items}
      onChange={onChange}
      {...tabProps}
    />
  );
}

export default AppHandledTab;
