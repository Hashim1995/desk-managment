import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography.Title>{t('welcomeText')}</Typography.Title>
    </div>
  );
}

export default Home;
