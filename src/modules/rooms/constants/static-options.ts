import { selectOption } from '@/models/common';
import { MenuProps } from 'antd';
import i18next from 'i18next';

const DocumentTypeId: selectOption[] = [
  {
    value: 1,
    label: i18next.t('contract')
  },
  {
    value: 2,
    label: i18next.t('attachment')
  },
  {
    value: 3,
    label: i18next.t('invoice')
  },
  {
    value: 4,
    label: i18next.t('act')
  }
];

const Status: selectOption[] = [
  {
    value: 1,
    label: i18next.t('pending')
  },
  {
    value: 2,
    label: i18next.t('returned')
  },
  {
    value: 3,
    label: i18next.t('agreed')
  },
  {
    value: 4,
    label: i18next.t('termination')
  },
  {
    value: 5,
    label: i18next.t('signed')
  },
  {
    value: 6,
    label: i18next.t('overdue')
  },
  {
    value: 7,
    label: i18next.t('rejected')
  },
  {
    value: 8,
    label: i18next.t('draft')
  },
  {
    value: 9,
    label: i18next.t('pendingSign')
  }
];

const items: MenuProps['items'] = [
  {
    label: i18next.t('attachment'),
    key: '2'
  },
  {
    label: i18next.t('invoice'),
    key: '3'
  },
  {
    label: i18next.t('act'),
    key: '4'
  }
];

export { DocumentTypeId, Status, items };
