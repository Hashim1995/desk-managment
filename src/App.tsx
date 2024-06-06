import { useNavigate, useRoutes } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { Suspense, useEffect } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useDispatch } from 'react-redux';
import routesList from '@/core/routes/routes';
import SuspenseLoader from './core/static-components/suspense_loader';
import { themeConfig } from './configs/global-configs';
import { AuthService } from './services/auth-services/auth_services';
import { setUser } from './redux/auth/auth_slice';
// import { useTranslation } from 'react-i18next';

function App() {
  const router = useRoutes(routesList);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  // eslint-disable-next-line no-unused-vars
  const [isDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', false);
  const userTokenData: any = useReadLocalStorage('userToken');
  const darkMode = useReadLocalStorage('darkTheme');
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const getMe = async () => {
    try {
      const getMeRes = await AuthService.getInstance().getMe();
      dispatch(setUser(getMeRes));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const hasToken = !!userTokenData?.token;

    if (!hasToken && window.location.pathname !== '/login') {
      navigate('/login');
    } else if (hasToken) {
      getMe();
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
