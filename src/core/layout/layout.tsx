import { Col, Dropdown, Layout, MenuProps, Row, Typography } from 'antd';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { FaMoon, FaSun } from 'react-icons/fa';
import { BiLogOut, BiUser } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import LanguageSelector from '@/components/langauge-selector/language-selector';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { setCurrentLayoutLanguage } from '@/redux/core/core-slice';
// import { LayoutLanguage } from '@/models/common';
import { RootState } from '@/redux/store';
import TokenizedImage from '@/components/display/image';
import Sidebar from '../static-components/sidebar';
import Footer from '../static-components/footer';

const { Header, Content } = Layout;
const { Text } = Typography;

function LayoutPage() {
  const {
    t
    // i18n
  } = useTranslation();

  const user = useSelector((state: RootState) => state.user.user);

  const [, setUserToken] = useLocalStorage<any>('userToken', null);
  const [isDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', true);
  const navigate = useNavigate();
  const darkMode = useReadLocalStorage('darkTheme');
  // const dispatch = useDispatch();
  // const currentLayoutLanguage = useSelector(
  //   (state: RootState) => state.core.currentLayoutLanguage
  // );

  // const changeLanguageHandler = (lang: string) => {
  //   i18n.changeLanguage(lang);
  //   dispatch(setCurrentLayoutLanguage(lang as LayoutLanguage));
  // };

  const toggleTheme = () => {
    setDarkTheme(prevValue => !prevValue);
  };

  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === '0') {
      navigate('personal-cabinet');
    }
    if (e.key === '1') {
      navigate('legal-cabinet');
    }
    if (e.key === '2') {
      toggleTheme();
    }
    if (e.key === '3') {
      setUserToken(null);
      navigate('/login');
    }
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <Row>
          <BiUser /> <Text>{t('personalCabinet')}</Text>
        </Row>
      ),
      key: '0'
    },

    {
      label: (
        <Row>
          {isDarkTheme ? (
            <>
              <FaSun /> <Text>{t('lightMode')}</Text>
            </>
          ) : (
            <>
              <FaMoon /> <Text>{t('nightMode')}</Text>
            </>
          )}
        </Row>
      ),
      key: '2'
    },
    {
      label: (
        <Row>
          <BiLogOut /> <Text>{t('logout')}</Text>
        </Row>
      ),
      key: '3'
    }
  ];

  return (
    <Layout
      style={{ minHeight: '100vh', overflowY: 'auto' }}
      className={darkMode ? 'darkMode' : ''}
    >
      <Sidebar />
      <Layout
        style={{
          paddingRight: 40,
          paddingLeft: 40,
          paddingTop: 20,
          paddingBottom: 20
        }}
      >
        <Header
          className="z-1001 box"
          style={{
            position: 'sticky',
            top: 10,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            lineHeight: 1,
            marginBottom: '15px',
            backgroundColor: darkMode ? '#141414' : '#006FEE'
          }}
        >
          <div style={{ paddingRight: '10px' }}>
            <Row align={'middle'} gutter={16}>
              <Col>{/* <NotificationsPopover /> */}</Col>
              <Col>
                <Text style={{ color: '#fff' }}> {user?.fullName || '-'} </Text>
              </Col>
              <Col>
                <Dropdown
                  overlayClassName="user-dropdown"
                  menu={{ items, onClick: handleMenuClick }}
                  trigger={['click']}
                  className="pointer"
                >
                  <TokenizedImage
                    useCach
                    tokenized
                    imgType="avatar"
                    circle
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                    src={'user?.getFile?.fileUrl' ?? null}
                  />
                </Dropdown>
              </Col>
              <Col>
                {/* <LanguageSelector
                  onLanguageChange={lang => changeLanguageHandler(lang)}
                  selectedLanguage={currentLayoutLanguage}
                /> */}
              </Col>
            </Row>
          </div>
        </Header>
        <Content style={{ overflow: 'initial' }}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default LayoutPage;
