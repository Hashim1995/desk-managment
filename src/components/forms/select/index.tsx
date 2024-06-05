import { Select, ConfigProvider, SelectProps, Empty } from 'antd';
import { t } from 'i18next';
// import { noDataText } from '@/utils/constants/texts';

function AppSelect(props: SelectProps) {
  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty description={t('empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    >
      <Select {...props} />
    </ConfigProvider>
  );
}

export default AppSelect;
