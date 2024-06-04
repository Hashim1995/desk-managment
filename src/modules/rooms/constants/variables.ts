import { TabsProps } from 'antd';
import i18next from 'i18next';

const edcListTabNavs: TabsProps['items'] = [
  {
    key: '1',
    label: i18next.t('all')
  },
  {
    key: '2',
    label: i18next.t('sent')
  },
  {
    key: '3',
    label: i18next.t('received')
  },
  {
    key: '4',
    label: i18next.t('draft').toLocaleUpperCase()
  }
];

export { edcListTabNavs };
