import { Empty, EmptyProps } from 'antd';
import { t } from 'i18next';
// import { noDataText } from "@/utils/constants/texts";

function AppEmpty(props: EmptyProps) {
  return (
    <Empty
      description={t('empty')}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      {...props}
    />
  );
}

export default AppEmpty;
