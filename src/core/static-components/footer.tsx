import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  // const { useToken } = theme;
  // const { token } = useToken();
  return (
    <Card
      className="box text-center box-margin-top "
      // style={{ backgroundColor: token.colorPrimary, color: token.colorWhite }}
    >
      {t('footerVersionText')}
    </Card>
  );
}

export default Footer;
