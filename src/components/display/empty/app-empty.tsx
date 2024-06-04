import { Empty, EmptyProps } from 'antd';
import { useTranslation } from 'react-i18next';
// import { noDataText } from "@/utils/constants/texts";

function AppEmpty(props: EmptyProps) {
  const { t } = useTranslation();

  return (
    <Empty
      description={props?.description || t('empty')}
      image={props?.image || Empty.PRESENTED_IMAGE_SIMPLE}
      {...props}
    />
  );
}

export default AppEmpty;
