import { Select, ConfigProvider, SelectProps, Empty } from 'antd';
// import { noDataText } from '@/utils/constants/texts';

function AppSelect(props: SelectProps) {
  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty description={'Empty'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    >
      <Select {...props} />
    </ConfigProvider>
  );
}

export default AppSelect;
