/* eslint-disable no-unused-vars */
import { useNavigate, useRoutes } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { Suspense, useEffect } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import routesList from '@/core/routes/routes';
import SuspenseLoader from './core/static-components/suspense_loader';
import { themeConfig } from './configs/global-configs';
// import { useTranslation } from 'react-i18next';

function App() {
  const router = useRoutes(routesList);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  // eslint-disable-next-line no-unused-vars
  const [isDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', false);
  const userTokenData: any = useReadLocalStorage('userToken');
  const darkMode = useReadLocalStorage('darkTheme');

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!userTokenData?.token;

    if (!hasToken && window.location.pathname !== '/login') {
      navigate('/login');
    } else if (hasToken && window.location.pathname === '/') {
      navigate('/home');
    }
    if (darkMode === null) {
      setDarkTheme(false);
    }
  }, [userTokenData?.token, navigate]);

  return (
    <ConfigProvider
      theme={themeConfig(darkMode, darkAlgorithm, defaultAlgorithm)}
    >
      <Suspense fallback={<SuspenseLoader />}>{router}</Suspense>
    </ConfigProvider>
  );
}

export default App;
